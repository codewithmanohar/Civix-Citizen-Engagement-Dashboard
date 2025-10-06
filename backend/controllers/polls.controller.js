import mongoose from "mongoose";
import Poll from "../models/polls.js";
import Vote from "../models/vote.js";

export const createPoll = async (req, res) => {
  try {
    const { title, options, targetLocation } = req.body;

    if (!title || !options || options.length < 2) {
      return res.status(400).json({
        message: "Poll must have a title and at least 2 options",
      });
    }

    const poll = new Poll({
      title,
      options: options.map((opt) => ({ optionText: opt })),
      createdBy: req.user.id,
      targetLocation,
    });

    await poll.save();
    res.status(201).json({ message: "Poll created successfully", poll });
  } catch (error) {
    res.status(500).json({ message: "Error creating poll", error: error.message });
  }
};


export const getPolls = async (req, res) => {
  try {
    // // Fetch only polls with status "Active"
    const polls = await Poll.find({ status: "Active" }).populate("createdBy", "name email");

    // Add vote counts and user voting status for each poll
    const pollsWithData = await Promise.all(
      polls.map(async (poll) => {
        // Get total vote count for this poll
        const voteCount = await Vote.countDocuments({ pollId: poll._id });

        let userHasVoted = false;
        if (req.user && req.user.id) {
          try {
            // Check all votes for this poll to debug
            const allVotesForPoll = await Vote.find({ pollId: poll._id });

            const existingVote = await Vote.findOne({
              pollId: poll._id,
              userId: req.user.id
            });
            userHasVoted = !!existingVote;
          } catch (err) {
            console.error('Error checking vote status:', err);
          }
        }

        return {
          ...poll.toObject(),
          totalResponses: voteCount,
          userHasVoted
        };
      })
    );

    res.status(200).json(pollsWithData);

  } catch (error) {
    res.status(500).json({ message: "Error fetching polls", error: error.message });
  }
};

export const getMyPolls = async (req, res) => {
  try {

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const polls = await Poll.find({ createdBy: req.user.id }).populate("createdBy", "name email");
    // console.log("Found polls for user:", polls.length);
    res.status(200).json(polls);
  } catch (error) {
    console.error("Error in getMyPolls:", error);
    res.status(500).json({ message: "Error fetching your polls", error: error.message });
  }
};

export const getClosedPolls = async (req, res) => {
  try {

    const polls = await Poll.find({ status: "Closed" });
    res.status(200).json({ polls });

  } catch (error) {
    console.log("error to fetching the closed polls ")
  }
}


export const getPollById = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id).populate("createdBy", "name email");
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    // Check if the requesting user has voted (only if authenticated)
    let userHasVoted = false;
    if (req.user && req.user.id) {
      try {
        const existingVote = await Vote.findOne({
          pollId: poll._id,
          userId: req.user.id
        });
        userHasVoted = !!existingVote;
        console.log(`getPollById - Poll ${poll.title}: User ${req.user.id} hasVoted = ${userHasVoted}, vote found:`, existingVote ? 'YES' : 'NO');
      } catch (err) {
        console.error('Error checking vote status in getPollById:', err);
      }
    }

    res.status(200).json({ ...poll.toObject(), userHasVoted });
  } catch (error) {
    console.error("Error in getPollById:", error);
    res.status(500).json({ message: "Error fetching poll", error: error.message });
  }
};


export const closePoll = async (req, res) => {
  try {
    const { pollId } = req.params;

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ success: false, message: "Poll not found" });
    }

    if (poll.status === "Closed") {
      return res.status(400).json({ success: false, message: "Poll is already closed" });
    }

    poll.status = "Closed";
    await poll.save();

    res.json({ success: true, message: "Poll closed successfully", poll });
  } catch (error) {
    console.error("Error closing poll:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};



export const getPollResults = async (req, res) => {
  try {
    const pollId = req.params.id;

    // Find poll
    const poll = await Poll.findById(pollId).populate("createdBy", "name email");
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    // Aggregate votes
    const votes = await Vote.aggregate([
      { $match: { pollId: poll._id } },
      { $group: { _id: "$selectedOption", count: { $sum: 1 } } },
    ]);

    const totalVotes = votes.reduce((acc, v) => acc + v.count, 0);

    const results = poll.options.map((opt) => {
      const voteObj = votes.find((v) => v._id === opt.optionText);
      const count = voteObj ? voteObj.count : 0;
      const percentage = totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : 0;

      return {
        option: opt.optionText,
        count,
        percentage: Number(percentage),
      };
    });

    let userHasVoted = false;
   
    if (req.user && req.user.id) {
      const existingVote = await Vote.findOne({
        pollId: pollId,
        userId: req.user.id, 
      });
      userHasVoted = !!existingVote;
    }

    res.status(200).json({
      pollId: poll._id,
      title: poll.title,
      userHasVoted,
      results,
      totalVotes,
      poll: {
        ...poll.toObject(),
        totalResponses: totalVotes
      }
    });
  } catch (error) {
    console.error("Error in getPollResults:", error);
    res.status(500).json({ message: "Error fetching poll results", error: error.message });
  }
};