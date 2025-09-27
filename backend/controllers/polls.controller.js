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
    const polls = await Poll.find().populate("createdBy", "name email");
    
    // Add vote counts and user voting status for each poll
    const pollsWithData = await Promise.all(
      polls.map(async (poll) => {
        // Get total vote count for this poll
        const voteCount = await Vote.countDocuments({ pollId: poll._id });
        
        let userHasVoted = false;
        if (req.user && req.user.id) {
          const existingVote = await Vote.findOne({ pollId: poll._id, userId: req.user.id });
          userHasVoted = !!existingVote;
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
    console.log("getMyPolls called");
    console.log("req.user:", req.user);
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    console.log("User ID from token:", req.user.id);
    const polls = await Poll.find({ createdBy: req.user.id }).populate("createdBy", "name email");
    console.log("Found polls for user:", polls.length);
    res.status(200).json(polls);
  } catch (error) {
    console.error("Error in getMyPolls:", error);
    res.status(500).json({ message: "Error fetching your polls", error: error.message });
  }
};



export const getPollById = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id).populate("createdBy", "name email");
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    // Check if the requesting user has voted (only if authenticated)
    let userHasVoted = false;
    if (req.user && req.user.id) {
      const existingVote = await Vote.findOne({ pollId: poll._id, userId: req.user.id });
      userHasVoted = !!existingVote;
    }

    res.status(200).json({ ...poll.toObject(), userHasVoted });
  } catch (error) {
    console.error("Error in getPollById:", error);
    res.status(500).json({ message: "Error fetching poll", error: error.message });
  }
};


export const deletePoll = async (req, res) => {
  try {
    const pollId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role; // "citizen", "official"

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    // Only poll creator or an official can delete
    if (poll.createdBy.toString() !== userId && userRole !== "official") {
      return res.status(403).json({ message: "You are not authorized to delete this poll" });
    }

    // Delete poll
    await Poll.findByIdAndDelete(pollId);

    // Optional: Clean up related votes
    await Vote.deleteMany({ pollId });

    res.status(200).json({ message: "Poll deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting poll", error: error.message });
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

    // Aggregate votes from Vote collection
    const votes = await Vote.aggregate([
      { $match: { pollId: poll._id } },
      { $group: { _id: "$selectedOption", count: { $sum: 1 } } },
    ]);

    // Total votes
    const totalVotes = votes.reduce((acc, v) => acc + v.count, 0);

    // Format results with percentages
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

    res.status(200).json({
      pollId: poll._id,
      title: poll.title,
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