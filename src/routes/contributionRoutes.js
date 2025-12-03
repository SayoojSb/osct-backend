const express = require('express');
const router = express.Router();

const { createContribution, getAllContributions, updateStatus, updateContribution, deleteContribution, getSingleContribution } = require('../controllers/contributionController')
const authMiddleware = require('../middlewares/authMiddleware')

router.post("/", authMiddleware, createContribution)
router.get( '/', authMiddleware, getAllContributions)
router.patch("/status/:id", authMiddleware, updateStatus)
router.put("/:id", authMiddleware, updateContribution);
router.delete("/:id", authMiddleware, deleteContribution)
router.get("/:id", authMiddleware, getSingleContribution);

module.exports = router;