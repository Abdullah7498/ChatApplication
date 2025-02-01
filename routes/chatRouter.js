const express = require("express");
const router = express.Router();
const chatController = require("../controllers/ChatController");

router.get("/fetch-users", chatController.getUser);
router.post("/create-conversation", chatController.conversation);
router.get("/get-conversation/:id", chatController.getConversation);
router.get(
  "/get-conversation-messages/:id",
  chatController.getConversationMessages
);

module.exports = router;
