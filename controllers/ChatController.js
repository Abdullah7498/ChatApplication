const User = require("../models/UserModal");
const Conversation = require("../models/ConversationModal");
const Message = require("../models/MessageModal");

const conversation = async (req, res) => {
  const { participants } = req.body;

  if (!participants || participants.length < 2) {
    return res
      .status(400)
      .json({ error: "At least two participants are required." });
  }

  try {
    const sortedParticipants = [...participants].sort();

    const existingConversation = await Conversation.findOne({
      participants: {
        $size: sortedParticipants.length,
        $all: sortedParticipants,
      },
    });

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }
    const conversation = new Conversation({ participants: sortedParticipants });
    await conversation.save();
    res.status(201).json(conversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ error: "Failed to create conversation." });
  }
};

const getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate({
        path: "participants",
        select: "-password -otp -token",
      })
      .exec();
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve conversation." });
  }
};

const getConversationMessages = async (req, res) => {
  try {
    const messages = await Message.find({ conversation: req.params.id })
      .sort({ createdAt: 1 })
      .exec();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve messages." });
  }
};

const getUser = async (req, res) => {
  const { email, name, date } = req.query;

  try {
    let query = {};

    if (email) {
      query.email = { $regex: email, $options: "i" };
    }

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    if (date) {
      const parsedDate = new Date(date);
      query.createdAt = { $gte: parsedDate };
    }

    const users = await User.find(query);

    res.status(200).json({
      data: users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error",
    });
  }
};

module.exports = {
  getUser,
  conversation,
  getConversation,
  getConversationMessages,
};
