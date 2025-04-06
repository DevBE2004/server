const jwt = require("jsonwebtoken");

const generateToken = (payload, res) => {
  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "7d" });
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: process.env.NODE_ENV !== "development" ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};
const generateCode = (n) => {
  let result = Math.floor(1 + Math.random() * 9).toString();
  for (let i = 1; i < n; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }

  return result;
};
const generateOrderId = () =>
  `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
const extractPublicId = (url) => {
  const regex = /upload\/(?:v\d+\/)?(.+?)(?=\.[^/]+$)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};
module.exports = {
  generateToken,
  generateCode,
  extractPublicId,
  generateOrderId,
};
