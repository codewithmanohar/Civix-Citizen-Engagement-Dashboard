import Poll from "../models/polls.js";
import Vote from "../models/vote.js";


// Delete all votes by user ID (admin function)
export const deleteVotesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Delete all votes by this user
    const result = await Vote.deleteMany({ userId });
    console.log(`Deleted ${result.deletedCount} votes for user ${userId}`);
    
    res.status(200).json({ 
      message: `Successfully deleted ${result.deletedCount} votes for user ${userId}`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error("Error deleting votes:", error);
    res.status(500).json({ message: "Error deleting votes", error: error.message });
  }
};

export const voteInPoll = async (req, res) => {
  try {
    const { option } = req.body;
    const pollId = req.params.id;
    const userId = req.user.id;
    
    console.log(`Vote attempt - PollId: ${pollId}, UserId: ${userId}, Option: ${option}`);

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
    console.log("Vote saved:", vote);

    // Increment option count in Poll
    const updateResult = await Poll.updateOne(
      { _id: pollId, "options.optionText": option },
      { $inc: { "options.$.votes": 1 } }
    );
    console.log("Poll update result:", updateResult);

    res.status(201).json({ message: "Vote submitted successfully", vote });
  } catch (error) {
    res.status(500).json({ message: "Error submitting vote", error: error.message });
  }
};
