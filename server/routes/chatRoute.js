const express = require("express");

const router = express.Router();

const chatController = require("../controllers/chatController");

router.post("/chat", chatController.postChat);

router.post("/post-head-sub", chatController.postSubheading);

router.get("/headings", chatController.getHeadings);

router.get("/headings/:headingId/subheadings", chatController.getSubheadings);

router.get("/responses", chatController.getAllResponses);

router.post("/give-feedback",chatController.postFeedback);

router.get("/get-all",chatController.getHeadingsWithSubheadings)

module.exports = router;
