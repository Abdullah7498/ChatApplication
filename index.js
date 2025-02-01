const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const mongoose = require("mongoose");

const authRouter = require("./routes/authRouter");
const chatRouter = require("./routes/chatRouter");
const userRouter = require("./routes/userRouter");

const Message = require("./models/MessageModal");
const Conversation = require("./models/ConversationModal");

const http = require("http");
const app = express();
app.use(cors());
app.use(express.json());

const socketIo = require("socket.io");
const { log } = require("console");
const server = http.createServer(app);
const io = socketIo(server);

const uri = process.env.MONGO_URI;

async function connectToMongo() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to MongoDB Atlas!");
  } catch (err) {
    console.error("Error connecting to MongoDB Atlas:", err);
  }
}

io.on("connection", (socket) => {
  socket.on("joinConversation", (data) => {
    socket.join(data.conversationId);
  });
  socket.on("sendMessage", async (data) => {
    try {
      const message = new Message({
        conversation: data.conversationId,
        sender: data.sender,
        text: data.text,
      });
      await message.save();
      await Conversation.findByIdAndUpdate(data.conversationId, {
        lastMessage: data.text,
        updatedAt: Date.now(),
      });
      io.to(data.conversationId).emit("receiveMessage", message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1", chatRouter);
app.use("/api/v1", userRouter);

app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  "/images",
  express.static("/home/abdullah/MERN/ChatApi/BackEnd/multer/public/images")
);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  connectToMongo().then(() => {
    console.log(`Server is running on port ${PORT}`);
  });
});
