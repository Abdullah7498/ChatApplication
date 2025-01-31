const express = require("express");
const router = express.Router();
const chatController = require("../controllers/ChatController");

router.get("/fetch-users", chatController.getUser);

module.exports = router;
