import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 YAHAN DALNA HAI URI
const MONGO_URI = "mongodb+srv://nitinraghav209_db_user:gAYPq2nZm1b9oH87@cluster0.mokav7v.mongodb.net/?appName=Cluster0";

const client = new MongoClient(MONGO_URI);
let db;

// 🔥 CONNECT DB
await client.connect();
db = client.db("elevateiq");

console.log("Mongo connected ✅");

// ✅ ROUTES
app.get("/", (req, res) => {
  res.send("API running 🚀");
});
app.get("/api/leaderboard", async (req, res) => {
  try {
    const users = db.collection("users");

    const lb = await users.find({})
      .sort({ coins: -1 })
      .limit(10)
      .toArray();

    res.json({
      success: true,
      leaderboard: lb.map((u, i) => ({
        rank: i + 1,
        name: u.userName || "User",
        coins: u.coins || 0,
        userId: u.userId
      }))
    });

  } catch (e) {
    res.json({ success: false, leaderboard: [] });
  }
});
app.get("/api/health", (req, res) => {
  res.json({ status: "ok 🚀" });
});

// ✅ EXAMPLE: verify code
app.post("/api/verify-code", async (req, res) => {
  const { code } = req.body;

  const codes = db.collection("codes");
  const existing = await codes.findOne({ code });

  if (!existing) return res.json({ valid: false });
  if (existing.used) return res.json({ valid: false, msg: "Used" });

  return res.json({ valid: true, game: existing.game });
});

// 🔥 START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running 🚀");
});
