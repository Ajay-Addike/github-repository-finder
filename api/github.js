const axios = require("axios");

module.exports = async (req, res) => {
  const { language } = req.query;
  const query = language ? `language:${language}` : "stars:>1";

  try {
    const response = await axios.get(
      `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc`,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch repositories" });
  }
};