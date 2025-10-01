import Petition from "../models/petition.js"; // assuming you have Petition model
import Signature from "../models/signature.js";
import Poll from "../models/polls.js";
import Vote from "../models/vote.js";


export const getDashboardStats = async (req, res) => {
  try {
    // Example: counts based on Petition status field
    const total = await Petition.countDocuments();
    const under_review = await Petition.countDocuments({ status: "under_review" });
    const active = await Petition.countDocuments({ status: "active" });
    const rejected = await Petition.countDocuments({ status: "rejected" });
    const resolved = await Petition.countDocuments({ status: "resolved" });

    res.json({
      success: true,
      stats: { total, under_review, active, rejected, resolved },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getPetitionCategories = async (req, res) => {
  try {
    const categories = await Petition.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          name: "$_id",
          value: "$count",
          _id: 0,
        },
      },
      { $sort: { value: -1 } },
    ]);

    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getPollsInsights = async (req, res) => {
  try {
    // Total polls
    const totalPolls = await Poll.countDocuments();

    // Active polls (example: polls created within last 30 days)
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    const now = new Date();
    const activePolls = await Poll.countDocuments({
      createdAt: { $gte: new Date(now - THIRTY_DAYS) },
    });

    const closedPolls = totalPolls - activePolls;

    // Total votes cast
    const totalVotes = await Vote.countDocuments();

    // Voter turnout as percentage of total votes / total polls (example)
    const voterTurnout = totalPolls > 0 ? ((totalVotes / totalPolls) * 100).toFixed(2) : 0;

    // Status breakdown for PieChart
    const status = [
      { name: "Active", value: activePolls },
      { name: "Closed", value: closedPolls },
    ];

    res.json({
      success: true,
      polls: {
        total: totalPolls,
        voter_turnout: voterTurnout,
        status,
      },
    });
  } catch (error) {
    console.error("Error fetching polls insights:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const getCombinedTrends = async (req, res) => {
  try {
    const [petitionTrends, pollTrends, voteTrends] = await Promise.all([
      Petition.aggregate([
        {
          $group: {
            _id: { month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } } },
            petitions: { $sum: 1 },
          },
        },
        { $project: { month: "$_id.month", petitions: 1, _id: 0 } },
        { $sort: { month: 1 } },
      ]),
      Poll.aggregate([
        {
          $group: {
            _id: { month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } } },
            polls: { $sum: 1 },
          },
        },
        { $project: { month: "$_id.month", polls: 1, _id: 0 } },
        { $sort: { month: 1 } },
      ]),
      Vote.aggregate([
        {
          $group: {
            _id: { month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } } },
            votes: { $sum: 1 },
          },
        },
        { $project: { month: "$_id.month", votes: 1, _id: 0 } },
        { $sort: { month: 1 } },
      ]),
    ]);

    // merge all trends
    const map = {};
    petitionTrends.forEach((t) => (map[t.month] = { month: t.month, petitions: t.petitions, polls: 0, votes: 0 }));
    pollTrends.forEach((t) => {
      if (!map[t.month]) map[t.month] = { month: t.month, petitions: 0, polls: t.polls, votes: 0 };
      else map[t.month].polls = t.polls;
    });
    voteTrends.forEach((t) => {
      if (!map[t.month]) map[t.month] = { month: t.month, petitions: 0, polls: 0, votes: t.votes };
      else map[t.month].votes = t.votes;
    });

    const combined = Object.values(map).sort((a, b) => a.month.localeCompare(b.month));

    res.json({ success: true, trends: combined });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
