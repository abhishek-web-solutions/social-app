import User from "../models/users.model.js";
import Profile from "../models/profiles.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
const converToUserDataTOPDF = async (userProfile) => {
  const doc = new PDFDocument();
  const outputpath = crypto.randomBytes(32).toString("hex") + ".pdf";
  const stream = fs.createWriteStream("uploads/" + outputpath);
  doc.pipe(stream);
  doc.image(userProfile.userId.profilePicture, { align: "center", width: 100 });
  doc.fontSize(20).text(`Name: ${userData.userId.name}`);
  doc.fontSize(20).text(`Email: ${userData.userId.email}`);
  doc.fontSize(20).text(`Username: ${userData.userId.username}`);
  doc.fontSize(20).text(`Bio: ${userProfile.bio}`);
  doc.fontSize(14).text(`Current Position:${userData.currentPosition}`);
  doc.fontSize(14).text("Past work");
  userData.pastWork.forEach((work) => {
    doc.fontSize(14).text(`Company: ${work.company}`);
    doc.fontSize(14).text(`Position: ${work.position}`);
    doc.fontSize(14).text(`Duration: ${work.year}`);
  });
  doc.end();
  return outputpath;
};

export const register = async (req, res) => {
  console.log(req);
  try {
    const { name, email, password, username } = req.body;

    // Check if user already exists
    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });
    await newUser.save();
    const profile = new Profile({ userId: newUser._id });
    await profile.save();
    return res.json({ message: "user created" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: error.message });
  }
};
// Login function
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const ismatch = await bcrypt.compare(password, user.password);
    if (!ismatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = crypto.randomBytes(16).toString("hex");
    await User.updateOne({ _id: user._id }, { token });
    return res.json({
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update profile picture function
export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;
  console.log(token);
  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    user.profilePicture = req.file.filename; // Assuming req.file contains the uploaded file
    await user.save();
    res.json({
      message: "Profile picture uploaded successfully",
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error("Error during profile picture upload:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Update profile function
export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const { username, email } = newUserData;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      if (existingUser || String(existingUser._id) !== String(user._id)) {
        return res
          .status(400)
          .json({ message: "Username or email already exists" });
      }
    }
    Object.assign(user, newUserData);
    await user.save();
    res.json({ message: "User profile updated successfully", user });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getUserAndProfile = async (req, res) => {
  try {
    console.log(req);
    console.log(req.body);
    console.log("req.body:", req.body);
    console.log("req.query:", req.query);
    console.log("req.headers:", req.headers);

    const { token } = req.query;
    console.log("Token received:", token);
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilePicture"
    );
    return res.json({ profile: userProfile });
  } catch (error) {
    console.error("Error fetching user and profile:", error);
    res.status(500).json({ message: error.message });
  }
};
export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newprofileData } = req.body;
    const userProfile = await User.findOne({ token: token });
    if (!userProfile) {
      return res.status(400).json({ message: "User not found" });
    }
    const profile_to_update = await Profile.findOne({
      userId: userProfile._id,
    });
    Object.assign(profile_to_update, newprofileData);
    await profile_to_update.save();
    res.json({
      message: "Profile data updated successfully",
      profile: profile_to_update,
    });
  } catch (error) {
    console.error("Error updating profile data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllUserProfile = async (req, res) => {
  console.log("inside user routes");
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name email username profilePicture"
    );

    return res.json({ profiles });
  } catch (error) {
    console.error("Error fetching all user profiles:", error);
    res.status(500).json({ message: error.message });
  }
};
export const downloadProfile = async (req, res) => {
  const user_id = req.query.id;
  const userProfile = await Profile.findOne({ userId: user_id }).populate(
    "userId",
    "name email username profilePicture"
  );
  let a = await converToUserDataTOPDF(userProfile);
  return res.json(a);
};
export const sendConnectionRequest = async (req, res) => {
  const { token, connectionID } = req.body;
  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const connectionUser = await User.findOne({ _id: connectionID });
    if (!connectionUser) {
      return res.status(400).json({ message: "Connection user not found" });
    }
    const existingRequest = await sendConnectionRequest.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
    });
    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Connection request already sent" });
    }
    const request = new sendConnectionRequest({
      userId: user._id,
      connectionId: connectionUser._id,
    });
    await request.save();
    res.json({ message: "Connection request sent successfully" });
  } catch (error) {
    console.error("Error sending connection request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyConnectionsRequests = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const connection = await connection
      .find({ userId: user._id })
      .populate("connectionId", "name email username profilePicture");
    return res.json(connection);
  } catch (error) {
    console.error("Error fetching connection requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const whatAreMyConnections = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const connections = await sendConnectionRequest
      .find({ connectionId: user._id })
      .populate("userId", "name email username profilePicture");
    return res.json(connections);
  } catch (error) {
    console.error("Error fetching connections:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  const { token, requestId, action_type } = req.body;
  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const connection = await sendConnectionRequest.findOne({ _id: requestId });
    if (!connection) {
      return res.status(400).json({ message: "Connection request not found" });
    }

    if (action_type === "accept") {
      connection.status.accepted = true;
    } else {
      connection.status.accepted = false;
    }
    await connection.save();
    res.json({
      message: "Connection request processed successfully",
      connection,
    });
  } catch (error) {
    console.error("Error accepting connection request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserprofileAndUserBaseOnUsername = async (req, res) => {
  const { username } = req.query;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilePicture"
    );
    return res.json({ profile: userProfile });
  } catch (error) {
    console.error("Error fetching user profile by username:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
