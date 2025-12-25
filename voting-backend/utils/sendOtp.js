const nodemailer = require('nodemailer');

const otpStore = new Map();
const verifiedEmails = new Set(); // ✅ New store

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtp = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore.set(email, otp);

  await transporter.sendMail({
  from: `"VoteYatra - Election Authority" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: '🔐 Your OTP for VoteYatra Verification',
  html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #2d6cdf; text-align: center;">🗳️ Welcome to VoteYatra</h2>
        <p style="font-size: 16px; color: #333333;">
          Thank you for choosing to vote with <strong>VoteYatra</strong> – your voice matters!
        </p>
        <p style="font-size: 16px; color: #333333;">
          Please use the following One-Time Password (OTP) to verify your email address and proceed:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="display: inline-block; padding: 10px 20px; font-size: 24px; color: #ffffff; background-color: #2d6cdf; border-radius: 5px; letter-spacing: 3px;">
            ${otp}
          </span>
        </div>
        <p style="font-size: 14px; color: #777777;">
          This OTP is valid for a short time only. Please do not share it with anyone.
        </p>
        <p style="font-size: 14px; color: #777777;">
          Need help? Contact us at <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a>
        </p>
        <hr style="margin: 30px 0;">
        <p style="font-size: 12px; color: #aaaaaa; text-align: center;">
          © ${new Date().getFullYear()} VoteYatra. All rights reserved.
        </p>
      </div>
    </div>
  `
});


  return otp;
};

const verifyOtp = (email, otp) => {
  const valid = otpStore.get(email) === parseInt(otp);
  if (valid) {
    verifiedEmails.add(email);
    otpStore.delete(email);
  }
  return valid;
};

const isEmailVerified = (email) => verifiedEmails.has(email);

module.exports = { sendOtp, verifyOtp,verifiedEmails, isEmailVerified };
