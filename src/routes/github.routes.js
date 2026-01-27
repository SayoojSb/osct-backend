const express = require("express");
const router = express.Router();
const { searchRepositories } = require("../controllers/github.controller");

router.get("/repos", searchRepositories);

module.exports = router;
