const mongoose = require("mongoose");

const dbConnected = async () => {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("kết nối thành công đến database");
    })
    .catch((err) => {
      console.error("kết nối database thất bại:", err);
    });
};
module.exports = dbConnected;
