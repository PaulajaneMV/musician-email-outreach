const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Import routes
const dashboardRoutes = require("./routes/dashboard");
const emailCampaignsRoutes = require("./routes/emailCampaigns");
const analyticsRoutes = require("./routes/analytics");
const tasksRoutes = require("./routes/tasks");
const profileRoutes = require("./routes/profile");
const settingsRoutes = require("./routes/settings");
const helpRoutes = require("./routes/help");
const authRoutes = require("./routes/auth"); // Import Authentication route

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000" })); // Replace with your frontend URL

// Use routes
app.use("/dashboard", dashboardRoutes);
app.use("/email-campaigns", emailCampaignsRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/tasks", tasksRoutes);
app.use("/profile", profileRoutes);
app.use("/settings", settingsRoutes);
app.use("/help", helpRoutes);
app.use("/auth", authRoutes); // Add Authentication route

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running.");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
