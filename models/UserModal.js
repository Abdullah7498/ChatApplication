const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const UserSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: {
    type: String,
    default: "http://localhost:8000/images/defaultImg.avif",
  },
  token: {
    value: { type: String },
    expires: { type: Date },
  },
  chatId: {
    type: String,
    default: () => uuidv4(),
  },
  createdAt: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  updatedAt: Date,
  lastLogin: Date,
  otp: {
    value: { type: Number },
    expires: { type: Date },
    attempts: { type: Number, default: 0 },
  },
});

module.exports = mongoose.model("User", UserSchema);
