import CommentModel from "../models/comments.js";
import PetitionModel from "../models/petition.js";

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const petition = await PetitionModel.findById(req.params.id);
    if (!petition) return res.status(404).json({ message: "Petition not found" });

    const comment = await CommentModel.create({
      petition: petition._id,
      user: req.user.id,   // from auth middleware
      text,
    });

    await comment.populate("user", "name email");
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const comments = await CommentModel.find({ petition: req.params.id })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
