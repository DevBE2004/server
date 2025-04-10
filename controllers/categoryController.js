const Category = require("../models/category");

const addCategory = async (req, res) => {
  const alreadyCategory = await Category.exists({ title: req.body.title });
  if (Boolean(alreadyCategory)) throw new Error("loại sản phẩm đã tồn tại.");
  const response = await Category.create(req.body);
  return res.json({
    success: Boolean(response),
    mes: Boolean(response)
      ? "thêm thành công."
      : "xảy ra một lỗi vui lòng thử lại.",
  });
};
const updateCategory = async (req, res) => {
  const response = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  return res.json({
    success: Boolean(response),
    mes: Boolean(response)
      ? "sửa thành công."
      : "loại sản phẩm không tồn tại.",
  });
};
const deleteCategory = async (req, res) => {
  const response = await Category.findByIdAndDelete(req.params.id);
  return res.json({
    success: Boolean(response),
    mes: Boolean(response)
      ? "xóa thành công."
      : "loại sản phẩm không tồn tại.",
  });
};
const getAll = async (req, res) => {
  const response = await Category.find();
  return res.json({
    success: Boolean(response),
    mes: Boolean(response)
      ? "thành công."
      : "không có loại sản phẩm nào cả.",
    data: response,
  });
};

module.exports = { addCategory, updateCategory, deleteCategory, getAll };
