const express = require("express");
const router = express.Router();

// Mock data for email campaigns
let campaigns = [
  { id: 1, name: "Holiday Promotions", status: "Sent", engagementRate: 80 },
  { id: 2, name: "New Album Launch", status: "Scheduled", engagementRate: null },
];

// 1. Get all campaigns with optional pagination
router.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedCampaigns = campaigns.slice(startIndex, endIndex);

  res.json({
    campaigns: paginatedCampaigns,
    total: campaigns.length,
    page,
    totalPages: Math.ceil(campaigns.length / limit),
  });
});

// 2. Get a specific campaign by ID
router.get("/:id", (req, res) => {
  const campaignId = parseInt(req.params.id);
  const campaign = campaigns.find((c) => c.id === campaignId);

  if (!campaign) {
    return res.status(404).json({ error: "Campaign not found" });
  }

  res.json(campaign);
});

// 3. Create a new campaign
router.post("/", (req, res) => {
  const { name, status, engagementRate } = req.body;

  if (!name || !status) {
    return res.status(400).json({ error: "Name and status are required" });
  }

  const newCampaign = {
    id: campaigns.length + 1,
    name,
    status,
    engagementRate: engagementRate || null,
  };

  campaigns.push(newCampaign);
  res.status(201).json({ message: "Campaign created successfully", campaign: newCampaign });
});

// 4. Update an existing campaign
router.put("/:id", (req, res) => {
  const campaignId = parseInt(req.params.id);
  const { name, status, engagementRate } = req.body;

  const campaign = campaigns.find((c) => c.id === campaignId);

  if (!campaign) {
    return res.status(404).json({ error: "Campaign not found" });
  }

  if (name) campaign.name = name;
  if (status) campaign.status = status;
  if (engagementRate !== undefined) campaign.engagementRate = engagementRate;

  res.json({ message: "Campaign updated successfully", campaign });
});

// 5. Delete a campaign
router.delete("/:id", (req, res) => {
  const campaignId = parseInt(req.params.id);
  const index = campaigns.findIndex((c) => c.id === campaignId);

  if (index === -1) {
    return res.status(404).json({ error: "Campaign not found" });
  }

  const deletedCampaign = campaigns.splice(index, 1);
  res.json({ message: "Campaign deleted successfully", campaign: deletedCampaign[0] });
});

// 6. Search campaigns by name or status
router.get("/search", (req, res) => {
  const { query, status } = req.query;

  let filteredCampaigns = campaigns;

  if (query) {
    filteredCampaigns = filteredCampaigns.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  if (status) {
    filteredCampaigns = filteredCampaigns.filter((c) => c.status === status);
  }

  res.json(filteredCampaigns);
});

// 7. Simulate sending a test email
router.post("/:id/test-email", (req, res) => {
  const campaignId = parseInt(req.params.id);
  const campaign = campaigns.find((c) => c.id === campaignId);

  if (!campaign) {
    return res.status(404).json({ error: "Campaign not found" });
  }

  res.json({ message: `Test email sent successfully for campaign: ${campaign.name}` });
});

module.exports = router;
