import nodemailer from 'nodemailer'
import { Verification_Email_Template } from './emailTemplate.js';
// import dotenv from 'dotenv'

// dotenv.config({ path: "../.env" });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Wrap in an async IIFE so we can use await.
const sendEmail = async (email, otp) => {
  try {
        const info = await transporter.sendMail({
        from: '"LinkDesk" <${process.env.EMAIL_USER}>',
        to: email,
        subject: "OTP Verification",
        text: "OTP verification", // plain‑text body
        html: Verification_Email_Template.replace("{verificationCode}", otp), // HTML body
        });
        // console.log("Message sent:", info.messageId);
    } catch(error) {
        console.log(error)
    }
};

export default sendEmail;