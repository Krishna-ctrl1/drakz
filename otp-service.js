require('dotenv').config();
const nodemailer = require("nodemailer");

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: "gmail", // Use Gmail, Outlook, Yahoo, or any SMTP provider
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS  // App password (not your actual email password)
    }
});

// Function to send OTP via email
async function sendOTP(email, otp) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP is: ${otp}. Do not share it with anyone.`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ OTP Sent via Email:", info.response);
        return { success: true };
    } catch (error) {
        console.error("❌ Error sending OTP:", error);
        return { success: false, error: error.message };
    }
}

module.exports = { sendOTP };