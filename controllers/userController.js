const User = require("../models/UserModal");
const mongoose = require("mongoose");

const addContact = async (req, res) => {
  const { userId, contactId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({ error: "Invalid contact ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.contacts.includes(contactId)) {
      return res.status(400).json({ error: "User already exists in contacts" });
    }

    user.contacts.push(contactId);
    await user.save();

    res.status(200).json({ message: "Contact added successfully" });
  } catch (err) {
    console.error("Error adding contact:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const getUserContactsById = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    const user = await User.findById(userId).populate({
      path: "contacts",
      select: "-password -otp -token -contacts",
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user.contacts);
  } catch (err) {
    console.error("Error fetching contacts:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  addContact,
  getUserContactsById,
};
