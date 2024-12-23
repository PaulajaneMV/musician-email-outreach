const express = require("express");
const { body, validationResult } = require("express-validator");
const multer = require("multer");

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// Mock user profile data
let userProfile = {
  username: "user123",
  email: "user123@example.com",
  role: "Musician",
  profilePicture: null, // Holds path to uploaded profile picture
};

// 1. Fetch User Profile
router.get("/", (req, res) => {
  if (!userProfile) {
    return res.status(404).json({ message: "User profile not found" });
  }
  res.status(200).json(userProfile);
});

// 2. Update User Profile
router.put(
  "/",
  [
    body("email").isEmail().withMessage("Invalid email format"),
    body("username").isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),
    body("role").notEmpty().withMessage("Role is required"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, role } = req.body;

    // Update mock user profile data
    userProfile.username = username;
    userProfile.email = email;
    userProfile.role = role;

    res.status(200).json({ message: "Profile updated successfully", userProfile });
  }
);

// 3. Upload Profile Picture
router.post("/upload", upload.single("profilePicture"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const profilePicturePath = req.file.path;
  userProfile.profilePicture = profilePicturePath;

  res.status(200).json({
    message: "Profile picture uploaded successfully",
    profilePicturePath,
  });
});

// 4. Delete User Profile
router.delete("/", (req, res) => {
  if (!userProfile) {
    return res.status(404).json({ message: "User profile not found" });
  }

  userProfile = null;

  res.status(200).json({ message: "User profile deleted successfully" });
});

module.exports = router;
