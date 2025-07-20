const express = require("express");
const router = express.Router();
const redisClient = require("../redis");
const { interpolatePrice } = require("../utils/interpolate");

// POST: Get price using timestamp (used for direct API access)
router.post("/", async (req, res) => {
  const { token, timestamp } = req.body;
  const key = `${token}:${timestamp}`;

  try {
    const now = Math.floor(Date.now() / 1000);
    if (timestamp > now) {
      return res.status(400).json({ error: "Future timestamp not allowed" });
    }

    const cached = await redisClient.get(key);
    if (cached) {
      return res.json({ price: parseFloat(cached), source: "cache" });
    }

    const price = interpolatePrice(timestamp);
    await redisClient.setEx(key, 300, price.toString());

    res.json({ price, source: "interpolated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET: Handle query from frontend
router.get("/", async (req, res) => {
  const { token, date } = req.query;

  if (!token || !date) {
    return res.status(400).json({ error: "Missing token or date" });
  }

  // Convert date (YYYY-MM-DD) to timestamp
  const timestamp = Math.floor(new Date(date).getTime() / 1000);
  const key = `${token}:${timestamp}`;

  try {
    const now = Math.floor(Date.now() / 1000);
    if (timestamp > now) {
      return res.status(400).json({ error: "Future date not allowed" });
    }

    const cached = await redisClient.get(key);
    if (cached) {
      return res.json({ price: parseFloat(cached), source: "cache" });
    }

    const price = interpolatePrice(timestamp);
    await redisClient.setEx(key, 300, price.toString());

    res.json({ price, source: "interpolated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
