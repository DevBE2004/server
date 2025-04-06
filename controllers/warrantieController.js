const Warrantie = require("../models/warrantie");
const Product = require("../models/product");

const addWarrantie = async (req, res) => {
  const alreadyWarrantie = await Warrantie.exists({
    productId: req.body.pid,
  });
  if (alreadyWarrantie) throw new Error("sản phẩm đã có bảo hành.");
  const response = await Warrantie.create(req.body);
  return res.json({
    success: Boolean(response),
    message: Boolean(response)
      ? "tạo thành công."
      : "tạo thất bại vui lòng thử lại",
  });
};
const updateWarrantie = async (req, res) => {
  const editWarrantie = await Warrantie.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  return res.json({
    success: Boolean(editWarrantie),
    message: Boolean(editWarrantie)
      ? "cập nhật thành công."
      : "sửa thất bại vui lòng thử lại.",
  });
};
const deleteWarrantie = async (req, res) => {
  const response = await Warrantie.findByIdAndDelete(req.params.id);
  return res.json({
    success: Boolean(response),
    message: Boolean(response)
      ? "xóa thành công."
      : "xóa thất bại vui lòng thử lại.",
  });
};
const getOne = async (req, res) => {
  const response = await Warrantie.findById(req.params.id);
  return res.json({
    success: Boolean(response),
    message: Boolean(response) ? "thành công." : "thất bại.",
    data: response,
  });
};
const getAll = async (req, res) => {
  const response = await Warrantie.find();
  // .populate({
  //   path: "productId",
  //   model: Product,
  // });
  return res.json({
    success: Boolean(response),
    message: Boolean(response) ? "thành công." : "thất bại.",
    data: response,
  });
};

module.exports = {
  addWarrantie,
  updateWarrantie,
  deleteWarrantie,
  getOne,
  getAll,
};
