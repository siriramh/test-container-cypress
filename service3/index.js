// backend/index.js
const express = require("express");
const { Pool } = require("pg");
const app = express();
const port = 3000;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "cms",
  password: "password",
  port: 5432,
});

app.use(express.json());

app.get("/api/posts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/posts", async (req, res) => {
  const { title, content } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *",
      [title, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
