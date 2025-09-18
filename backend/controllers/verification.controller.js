import UserModel from "../models/user.js";


export const requestVerification = async (req, res) => {
  try {
    const { idDocumentType, idDocumentNumber, idDocumentUrl } = req.body;

    const user = await UserModel.findByIdAndUpdate(
      req.user.id,
      {
        idDocumentType,
        idDocumentNumber,
        idDocumentUrl,
        verificationStatus: "pending"
      },
      { new: true }
    );

    res.json({ message: "Verification requested", userVerificationStatus: user.verificationStatus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const approveVerification = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.verificationStatus === "verified") {
      return res.status(400).json({ error: "User is already verified" });
    }

    if (user.verificationStatus !== "pending") {
      return res.status(400).json({ error: "User has to upload document for verification" });
    } 

    user.verificationStatus = "verified";
    await user.save();
    res.json({ message: "User verified successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const rejectVerification = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { verificationStatus: "unverified" },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Verification rejected", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPendingVerifications = async (req, res) => { 
  const pendingUsers = await User.find({verificationStatus : "pending"})
  .select("-password"); 

  return res.status(200).json(pendingUsers);
}
