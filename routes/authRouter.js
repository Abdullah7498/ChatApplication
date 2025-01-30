const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");
const upload = require("../multer/multer");

router.post("/signup", upload.single("avatar"), authController.SignUp);
router.post("/login", authController.Login);
router.post("/verify-otp", authController.VerifyOTP);
router.post("/generate-otp", authController.GenerateOTP);
router.post("/reset-password", authController.ResetPassword);

module.exports = router;
