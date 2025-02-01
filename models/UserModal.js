const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  avatar: {
    type: String,
    default: "http://localhost:8000/images/defaultImg.avif",
  },
  about: { type: String, default: "Hey there! I am using ChatApp." },
  emailVerified: { type: Boolean, default: false },
  emailVerification: {
    token: { type: String },
    expires: { type: Date },
  },
  otp: {
    value: { type: Number },
    expires: { type: Date },
    attempts: { type: Number, default: 0 },
  },
  token: {
    value: { type: String },
    expires: { type: Date },
  },
  chatId: {
    type: String,
    default: () => uuidv4(),
  },
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
});
UserSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("User", UserSchema);
