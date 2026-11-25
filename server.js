const express = require("express");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;
const processed = new Set();

app.use(express.json({ limit: "64kb" }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.get("/", (req, res) => {
  res.send("AIT MINER CLOUD is running!");
});

app.get("/api/status", (req, res) => {
  res.json({
    online: true,
    project: "AIT MINER CLOUD",
    rewards: "disabled",
    message: "Cloud server operational"
  });
});

app.post("/api/submit", (req, res) => {
  const { taskId, payload, hash } = req.body || {};

  if (!taskId || typeof payload !== "string" || typeof hash !== "string") {
    return res.status(400).json({ error: "Invalid task data" });
  }

  const expected = crypto
    .createHash("sha256")
    .update(payload)
    .digest("hex");

  if (expected !== hash.toLowerCase()) {
    return res.status(400).json({ error: "Hash verification failed" });
  }

  if (processed.has(taskId)) {
    return res.status(409).json({ error: "Task already submitted" });
  }

  processed.add(taskId);

  res.json({
    accepted: true,
    taskId,
    verified: true,
    reward: 0,
    rewardStatus: "disabled"
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("AIT MINER CLOUD running on port " + PORT);
});
