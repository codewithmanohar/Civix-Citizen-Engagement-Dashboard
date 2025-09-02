import PetitionModel from "../models/petition.js";

export const createPetition = async (req, res) => {
  try {
    const { title, description, category, location} = req.body;
    const createdBy = req.user.id;

    const newPetition = new PetitionModel({
      title,
      description,
      category,
      createdBy, 
      location
    });

    const savedPetition = await newPetition.save();
    res.status(201).json(savedPetition);
  } catch (error) {
    res.status(500).json({ message: "Error creating petition", error: error.message });
  }
};


export const getAllPetitions = async (req, res) => {
  try {
    const petitions = await PetitionModel.find().populate("createdBy", "name email");
    res.status(200).json(petitions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching petitions", error: error.message });
  }
};


export const getPetitionById = async (req, res) => {
  try {
    const petition = await PetitionModel.findById(req.params.id).populate("createdBy", "name email");

    if (!petition) {
      return res.status(404).json({ message: "Petition not found" });
    }

    res.status(200).json(petition);
  } catch (error) {
    res.status(500).json({ message: "Error fetching petition", error: error.message });
  }
};


export const updatePetition = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const petition = await PetitionModel.findByIdAndUpdate(
      req.params.id,
      { title, description, category },
      { new: true, runValidators: true }
    );

    if (!petition) {
      return res.status(404).json({ message: "Petition not found" });
    }

    res.status(200).json(petition);
  } catch (error) {
    res.status(500).json({ message: "Error updating petition", error: error.message });
  }
};


export const deletePetition = async (req, res) => {
  try {
    const petition = await PetitionModel.findByIdAndDelete(req.params.id);

    if (!petition) {
      return res.status(404).json({ message: "Petition not found" });
    }

    res.status(200).json({ message: "Petition deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting petition", error: error.message });
  }
};


