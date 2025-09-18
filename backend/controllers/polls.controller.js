import Poll from "../models/polls.js";
import vote from "../models/vote.js";

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
    const polls = await Poll.find();
    res.status(200).json(polls);
  } catch (error) {
    res.status(500).json({ message: "Error fetching polls", error: error.message });
  }
};


export const getPollById = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id).populate("createdBy", "name email");
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }
    res.status(200).json(poll);
  } catch (error) {
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
    await vote.deleteMany({ pollId });

    res.status(200).json({ message: "Poll deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting poll", error: error.message });
  }
};