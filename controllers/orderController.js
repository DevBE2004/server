const Order = require("../models/order");
const User = require("../models/user");
const Product = require("../models/product");

const addOrder = async (req, res) => {
  console.log(req.body);

  const response = await Order.create(req.body);
  return res.json({
    success: Boolean(response),
    message: Boolean(response)
      ? "thêm thành công"
      : "thêm thất bại vui lòng thử lại",
  });
};
const updateOrder = async (req, res) => {
  const response = await Order.findByIdAndUpdate(req.params.id, req.body);
  return res.json({
    success: Boolean(response),
    message: Boolean(response)
      ? "sửa thành công"
      : "sửa thất bại vui lòng thử lại",
  });
};
const deleteOrder = async (req, res) => {
  const response = await Order.findByIdAndDelete(req.params.id);
  return res.json({
    success: Boolean(response),
    message: Boolean(response)
      ? "xóa thành công"
      : "xóa thất bại vui lòng thử lại",
  });
};
const getOne = async (req, res) => {
  const response = await Order.findById(req.params.id);
  return res.json({
    success: Boolean(response),
    message: Boolean(response) ? "thành công" : "thất bại vui lòng thử lại",
    data: response,
  });
};

const getAll = async (req, res) => {
  const { limit = 10, page = 1, sort = "-createdAt", status } = req.query;

  const queries = {};

  if (status) queries.status = status;

  const total = await Order.countDocuments(queries);
  const totalPages = Math.ceil(total / limit);

  const orders = await Order.find(queries)
    .skip(Math.max(page - 1, 0) * limit)
    .limit(limit)
    .sort(sort)
    .populate({
      path: "orderBy",
      model: User,
    })
    .populate({
      path: "products.product",
      model: Product,
    });

  return res.json({
    success: true,
    message: orders.length
      ? "Lấy đơn hàng thành công"
      : "Không tìm thấy đơn hàng",
    data: orders,
    pagination: {
      page: +page,
      limit: +limit,
      total: total,
      totalPages: totalPages,
    },
  });
};

module.exports = {
  addOrder,
  updateOrder,
  deleteOrder,
  getOne,
  getAll,
};
