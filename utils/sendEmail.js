const nodemailer = require("nodemailer");
require("dotenv");
const sendEmail = (email, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "Gmail",
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: {
      name: process.env.EMAIL_FROM_NAME,
      address: process.env.EMAIL_FROM_ADDRESS,
    },
    to: email,
    subject,
    html,
  };

  const info = transporter.sendMail(mailOptions);
  return info;
};

module.exports = sendEmail;
