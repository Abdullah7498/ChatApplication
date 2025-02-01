const bcrypt = require("bcrypt");
const User = require("../models/UserModal");
const crypto = require("crypto");
const mail = require("../email/OtpService");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const SignUp = async (req, res) => {
  const { name, email, password } = req.body;
  const avatar = req.file ? `/images/${req.file.filename}` : null;
  if (!name || !email || !password) {
    return res.status(400).json({ data: { error: "All fields are required" } });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ data: { error: "Email already exists" } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      avatar,
      otp: { value: otp, expires: Date.now() + 3600000 },
    });

    await newUser.save();

    await mail(email, otp);

    res.status(201).json({
      data: { message: "User created successfully. OTP sent to email." },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ data: { error: "Server error" } });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ data: { error: "Email and password are required" } });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ data: { error: "User not found" } });
    }
    if (user.isVerified === false) {
      return res.status(401).json({ data: { error: "User is not verified" } });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ data: { error: "Invalid credentials" } });
    }

    const token = crypto.randomBytes(16).toString("hex");
    user.token = { value: token, expires: Date.now() + 3600000 };
    user.lastLogin = Date.now();
    await user.save();

    res.json({ data: { message: "Login successful", user, token: token } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ data: { error: "Server error" } });
  }
};

const VerifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .json({ data: { error: "Email and OTP are required" } });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ data: { error: "User not found" } });
    }

    if (user.otp.value !== otp) {
      return res.status(400).json({ data: { error: "Invalid OTP" } });
    }

    if (user.otp.expires < Date.now()) {
      return res.status(400).json({ data: { error: "OTP has expired" } });
    }

    user.isVerified = true;
    user.otp = {};
    await user.save();

    res.json({ data: { message: "OTP verified successfully" } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ data: { error: "Server error" } });
  }
};

const GenerateOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ data: { error: "Email is required" } });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ data: { error: "User not found" } });
    }

    const otp = generateOTP();
    user.otp = { value: otp, expires: Date.now() + 3600000 };
    await user.save();

    await mail(email, otp);

    res.json({ data: { message: "OTP sent to email" } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ data: { error: "Server error" } });
  }
};

const ResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res
      .status(400)
      .json({ data: { error: "Email, OTP, and new password are required" } });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ data: { error: "User not found" } });
    }

    if (user.otp.value !== otp) {
      return res.status(400).json({ data: { error: "Invalid OTP" } });
    }

    if (user.otp.expires < Date.now()) {
      return res.status(400).json({ data: { error: "OTP has expired" } });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = {};
    await user.save();

    res.json({ data: { message: "Password reset successfully" } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ data: { error: "Server error" } });
  }
};
module.exports = {
  SignUp,
  Login,
  VerifyOTP,
  GenerateOTP,
  ResetPassword,
};
