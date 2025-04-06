const JWT = require("jsonwebtoken");

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt || req.cookies["jwt"];

  if (!token) throw new Error("bạn chưa đăng nhập.");

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) throw new Error("Token hết hạn hoặc không hợp lệ!");
    req.user = decoded;
    next();
  });
};
const isAdmin = (req, res, next) => {
  const checkRole = req.user.role !== "ADMIN";
  if (checkRole) throw new Error("không có quyền!");
  next();
};
module.exports = { verifyToken, isAdmin };
