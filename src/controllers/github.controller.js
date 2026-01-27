const axios = require("axios");

const GITHUB_SEARCH_URL = "https://api.github.com/search/repositories";

exports.searchRepositories = async (req, res) => {
  try {
    const {
      q = "",
      language,
      minStars,
      sort = "stars",
      order = "desc",
      page = 1,
      perPage = 10,
    } = req.query;

    // --- Build GitHub search query ---
    let searchQuery = (q || "stars:>1").trim();

    if (language) {
      searchQuery += ` language:${language}`;
    }

    if (minStars) {
      if (isNaN(minStars)) {
        return res.status(400).json({
          error: "Invalid query",
          message: "minStars must be a number",
        });
      }
      searchQuery += ` stars:>=${minStars}`;
    }

    // --- Debug (TEMPORARY) ---
    console.log("-------------------------------------------------");
    console.log("Incoming Params:", req.query);
    console.log("Constructed GitHub Query:", searchQuery);
    console.log("-------------------------------------------------");

    // --- GitHub API request using axios ---
    const githubRes = await axios.get(GITHUB_SEARCH_URL, {
      params: {
        q: searchQuery,
        sort,
        order,
        page,
        per_page: perPage,
      },
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "osct-backend",
      },
    });

    const data = githubRes.data;

    // --- Normalize response ---
    const repos = data.items.map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      htmlUrl: repo.html_url,
      stars: repo.stargazers_count,
      openIssues: repo.open_issues_count,
      language: repo.language,
      updatedAt: repo.updated_at,
      owner: {
        username: repo.owner.login,
        avatarUrl: repo.owner.avatar_url,
      },
    }));

    return res.json({
      meta: {
        total: data.total_count,
        page: Number(page),
        perPage: Number(perPage),
        hasNextPage: page * perPage < data.total_count,
      },
      repos,
    });
  } catch (err) {
    console.error("Search repos error:", err);
    return res.status(500).json({
      error: "Server error",
      message: "Something went wrong while fetching repositories",
    });
  }
};
