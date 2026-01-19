const contributionService = require("../services/contributionService");

const createContribution = async (req, res) => {
  try {
    const { title, repoName, description, prLink, status, difficulty } = req.body;

    // ✅ FIXED
    const userId = req.user.userId;

    if (!title || !repoName || !description || !prLink || !status || !difficulty) {
      return res.status(400).json({ message: "All fields required" });
    }

    const result = await contributionService.createNew(
      title,
      repoName,
      description,
      prLink,
      status,
      difficulty,
      userId
    );

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    return res.status(201).json({
      message: result.message,
      contribution: result.newContribution,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getAllContributions = async (req, res) => {
  try {
    const { page, limit, search, status, difficulty, sort } = req.query;

    // ✅ FIXED
    const userId = req.user.userId;

    const result = await contributionService.getAll(
      userId,
      page,
      limit,
      search,
      status,
      difficulty,
      sort
    );

    return res.status(200).json({
      success: true,
      contributions: result.contributions,
      pagination: {
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // ✅ FIXED
    const userId = req.user.userId;

    if (!status) {
      return res.status(400).json({ message: "New status is required" });
    }

    const result = await contributionService.updateStatus(id, userId, status);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    return res.status(200).json({
      message: "Status updated successfully",
      updated: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateContribution = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // ✅ FIXED
    const userId = req.user.userId;

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Update data required" });
    }

    const result = await contributionService.updateContribution(id, userId, updateData);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    return res.status(200).json({
      message: "Contribution updated successfully",
      updated: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteContribution = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ FIXED
    const userId = req.user.userId;

    const result = await contributionService.deleteContribution(id, userId);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    return res.status(200).json({ message: result.message });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getSingleContribution = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ FIXED
    const userId = req.user.userId;

    const result = await contributionService.getSingle(id, userId);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    return res.status(200).json({ contribution: result });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createContribution,
  getAllContributions,
  updateStatus,
  updateContribution,
  deleteContribution,
  getSingleContribution,
};
