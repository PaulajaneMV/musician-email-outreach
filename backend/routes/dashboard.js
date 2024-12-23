const express = require("express");
const router = express.Router();

// Mock campaign data
const campaigns = [
  { id: 1, name: "Campaign 1", emailsSent: 500, engagementRate: 0.5, newLeads: 50 },
  { id: 2, name: "Campaign 2", emailsSent: 1000, engagementRate: 0.7, newLeads: 100 },
  { id: 3, name: "Campaign 3", emailsSent: 300, engagementRate: 0.3, newLeads: 30 },
];

// Dashboard summary route
router.get("/", (req, res) => {
  const totalCampaigns = campaigns.length;
  const totalEmailsSent = campaigns.reduce((sum, campaign) => sum + campaign.emailsSent, 0);
  const averageEngagementRate =
    campaigns.reduce((sum, campaign) => sum + campaign.engagementRate, 0) / totalCampaigns;
  const totalNewLeads = campaigns.reduce((sum, campaign) => sum + campaign.newLeads, 0);

  res.json({
    totalCampaigns,
    totalEmailsSent,
    averageEngagementRate: Math.round(averageEngagementRate * 100), // Convert to percentage
    totalNewLeads,
  });
});

// Retrieve detailed information about a specific campaign
router.get("/:id", (req, res) => {
  const campaignId = parseInt(req.params.id);
  const campaign = campaigns.find((c) => c.id === campaignId);

  if (!campaign) {
    return res.status(404).json({ error: "Campaign not found" });
  }

  res.json(campaign);
});

// Add a new campaign
router.post("/", (req, res) => {
  const { name, emailsSent, engagementRate, newLeads } = req.body;

  if (!name || emailsSent == null || engagementRate == null || newLeads == null) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newCampaign = {
    id: campaigns.length + 1, // Auto-generate ID
    name,
    emailsSent,
    engagementRate,
    newLeads,
  };

  campaigns.push(newCampaign);
  res.status(201).json({ message: "Campaign added successfully", campaign: newCampaign });
});

// Update an existing campaign
router.put("/:id", (req, res) => {
  const campaignId = parseInt(req.params.id);
  const { name, emailsSent, engagementRate, newLeads } = req.body;

  const campaign = campaigns.find((c) => c.id === campaignId);

  if (!campaign) {
    return res.status(404).json({ error: "Campaign not found" });
  }

  if (name) campaign.name = name;
  if (emailsSent != null) campaign.emailsSent = emailsSent;
  if (engagementRate != null) campaign.engagementRate = engagementRate;
  if (newLeads != null) campaign.newLeads = newLeads;

  res.json({ message: "Campaign updated successfully", campaign });
});

// Delete a campaign
router.delete("/:id", (req, res) => {
  const campaignId = parseInt(req.params.id);
  const index = campaigns.findIndex((c) => c.id === campaignId);

  if (index === -1) {
    return res.status(404).json({ error: "Campaign not found" });
  }

  const deletedCampaign = campaigns.splice(index, 1); // Remove the campaign
  res.json({ message: "Campaign deleted successfully", campaign: deletedCampaign[0] });
});

// Search campaigns by name
router.get("/search", (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  const results = campaigns.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  res.json(results);
});

module.exports = router;
