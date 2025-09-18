import Poll from "../models/polls.js";
import Vote from "../models/vote.js";


export const voteInPoll = async (req, res) => {
  try {
    const { option } = req.body;
    const pollId = req.params.id;
    const userId = req.user.id;

    // Check if poll exists
    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    // Check if option is valid
    const validOption = poll.options.find((o) => o.optionText === option);
    if (!validOption) {
      return res.status(400).json({ message: "Invalid option selected" });
    }

    // Prevent duplicate voting
    const existingVote = await Vote.findOne({ pollId, userId });
    if (existingVote) {
      return res.status(400).json({ message: "You have already voted in this poll" });
    }

    // Save vote
    const vote = new Vote({ pollId, userId, selectedOption: option });
    await vote.save();

    // Increment option count in Poll
    await Poll.updateOne(
      { _id: pollId, "options.optionText": option },
      { $inc: { "options.$.votes": 1 } }
    );

    res.status(201).json({ message: "Vote submitted successfully", vote });
  } catch (error) {
    res.status(500).json({ message: "Error submitting vote", error: error.message });
  }
};
