const express = require("express");
const router = express.Router();

// Mock analytics data
const analyticsData = {
  summary: {
    openRate: 45, // %
    clickRate: 30, // %
    bounceRate: 10, // %
    emailsDelivered: 5000, // Total emails delivered
  },
  performanceOverTime: [
    { month: "Jan", openRate: 40, clickRate: 20 },
    { month: "Feb", openRate: 50, clickRate: 25 },
    { month: "Mar", openRate: 60, clickRate: 30 },
    { month: "Apr", openRate: 65, clickRate: 35 },
    { month: "May", openRate: 70, clickRate: 40 },
  ],
};

// Route to get analytics summary
router.get("/summary", (req, res) => {
  res.json(analyticsData.summary);
});

// Route to get performance over time
router.get("/performance", (req, res) => {
  res.json(analyticsData.performanceOverTime);
});

// Route to add mock analytics data (for testing)
router.post("/add", (req, res) => {
  const { month, openRate, clickRate } = req.body;

  if (!month || openRate == null || clickRate == null) {
    return res.status(400).json({ error: "All fields are required" });
  }

  analyticsData.performanceOverTime.push({ month, openRate, clickRate });
  res.status(201).json({ message: "Analytics data added successfully" });
});

module.exports = router;
