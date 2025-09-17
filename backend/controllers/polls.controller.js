import Poll from "../models/polls.js";

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
      createdBy: req.user.id, // assuming JWT middleware adds user
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
