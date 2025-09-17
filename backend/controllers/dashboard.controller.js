import PetitionModel from "../models/petition.js";

export const getPetitionStats = async (req, res) => {
  try {
    const total = await PetitionModel.countDocuments();
    const pending = await PetitionModel.countDocuments({ status: "Pending" });
    const approved = await PetitionModel.countDocuments({ status: "Approved" });
    const rejected = await PetitionModel.countDocuments({ status: "Rejected" });
    const resolved = await PetitionModel.countDocuments({ status: "Resolved" });

    res.status(200).json({
      success: true,
      stats: { total, pending, approved, rejected, resolved },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// export const getPetitionCategoryStats = async (req, res) => {
//   try {
//     const categoryStats = await PetitionModel.aggregate([
//       { $group: { _id: "$category", count: { $sum: 1 } } },
//       { $sort: { count: -1 } },
//     ]);

//     res.status(200).json({
//       success: true,
//       categoryStats,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

export const getPetitionCategoryStats = async (req, res) => {
  try {
    const categoryStats = await PetitionModel.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Split into labels & data arrays
    const labels = categoryStats.map(item => item._id);
    const data = categoryStats.map(item => item.count);

    res.status(200).json({
      success: true,
      labels,
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getRecentPetitions = async (req, res) => {
  try {
    const recent = await PetitionModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title status ").populate("createdBy" , "name").populate("signatures");

    res.status(200).json({
      success: true,
      recent,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};