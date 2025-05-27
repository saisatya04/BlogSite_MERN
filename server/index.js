const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const Post = require("./models/Post");
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const URI = process.env.MONGO_URI;

mongoose
  .connect(
    URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/posts", async (req, res) => {
  const { page = 1, search = "" } = req.query; // Default page is 1
  const limit = 5; // Number of posts per page
  const skip = (page - 1) * limit; // Calculate the number of posts to skip

  // Search query to match title or tags
  const query = search
    ? {
        $or: [
          { title: new RegExp(search, "i") },
          { tags: new RegExp(search, "i") },
        ],
      }
    : {};

  try {
    const posts = await Post.find(query).skip(skip).limit(limit);
    const total = await Post.countDocuments(query); // Total number of posts matching the query
    res.json({ posts, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching posts", error: err.message });
  }
});

app.get("/posts/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.json(post);
});

app.post("/posts", async (req, res) => {
  const post = new Post(req.body);
  await post.save();
  res.json(post);
});

app.put("/posts/:id", async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(post);
});

app.delete("/posts/:id", async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: "Post deleted" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
