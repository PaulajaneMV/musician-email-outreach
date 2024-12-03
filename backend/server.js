// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config(); // Load environment variables

// Initialize the app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000" })); // Replace with your frontend URL

// Mock database
const users = []; // Temporary in-memory user data
const venues = [
  { id: 1, name: "Venue 1", city: "London", email: "contact@venue1.com" },
  { id: 2, name: "Venue 2", city: "Manchester", email: "contact@venue2.com" },
  { id: 3, name: "Venue 3", city: "Birmingham", email: "contact@venue3.com" },
];

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running. Use /save-form-data or /venues to interact with the API.");
});

// Save Form Data Route
app.post("/save-form-data", async (req, res) => {
  const { email, city, tier, email_content } = req.body;

  // Validate input
  if (!email || !city || !tier || !email_content) {
    return res.status(400).send({ error: "All fields are required!" });
  }

  // Save data to mock database
  users.push({ email, city, tier, email_content });

  try {
    // Forward data to Make.com Webhook
    const makeWebhookUrl = "https://hook.eu2.make.com/pg3cwk2884x26kfdjvm2l28lqnooniyc"; // Your Make.com Webhook
    await axios.post(makeWebhookUrl, {
      email,
      city,
      tier,
      email_content,
    });

    res.status(200).send({
      message: "Data saved and forwarded to Make.com successfully",
      users, // Return the updated mock database for reference
    });
  } catch (error) {
    console.error("Error forwarding data to Make.com:", error.message);
    res.status(500).send({ error: "Failed to forward data to Make.com" });
  }
});

// Retrieve Venue Data Route
app.get("/venues", (req, res) => {
  const city = req.query.city || "All UK";

  if (city === "All UK") {
    res.status(200).send(venues);
  } else {
    const filteredVenues = venues.filter((venue) => venue.city === city);
    res.status(200).send(filteredVenues);
  }
});

// Start the server
const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
