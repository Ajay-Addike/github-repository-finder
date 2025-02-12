require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors()); // Allow frontend requests

const PORT = process.env.PORT || 5050; // Change to 5001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

app.get("/api/github", async (req, res) => {
    try {
        const { language } = req.query; // Get language from query params
        const query = language ? `language:${language}` : "stars:>1";
        const url = `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc`;

        const response = await fetch(url, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` },
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
