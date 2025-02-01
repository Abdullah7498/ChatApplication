const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/add-contact", userController.addContact);
router.get("/contacts/:userId", userController.getUserContactsById);

module.exports = router;
