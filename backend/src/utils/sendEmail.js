// utils/sendEmail.js
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendOtpEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `"Nepshift" <${process.env.MAIL_FROM}>`,
    to: toEmail,
    subject: "Nepshift - Password Reset OTP",
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    html: `<p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
  };
  return transporter.sendMail(mailOptions);
};

export default transporter;
