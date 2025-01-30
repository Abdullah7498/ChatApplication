const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = (to, otp) => {
  const otpTemplate = fs.readFileSync(
    path.join(__dirname, "otp-template.html"),
    "utf-8"
  );
  const emailHtml = otpTemplate.replace("{{otp}}", otp);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "OTP for Your Verification",
    html: emailHtml,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending OTP email:", error);
    } else {
      console.log("OTP email sent:", info.response);
    }
  });
};

module.exports = sendOtpEmail;
