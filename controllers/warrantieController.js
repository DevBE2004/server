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
    mes: Boolean(response)
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
    mes: Boolean(editWarrantie)
      ? "cập nhật thành công."
      : "sửa thất bại vui lòng thử lại.",
  });
};
const deleteWarrantie = async (req, res) => {
  const response = await Warrantie.findByIdAndDelete(req.params.id);
  return res.json({
    success: Boolean(response),
    mes: Boolean(response)
      ? "xóa thành công."
      : "xóa thất bại vui lòng thử lại.",
  });
};
const getOne = async (req, res) => {
  const response = await Warrantie.findById(req.params.id);
  return res.json({
    success: Boolean(response),
    mes: Boolean(response) ? "thành công." : "thất bại.",
    data: response,
  });
};
const getAll = async (req, res) => {
  const {
    limit = 10,
    page = 1,
    sort = "-createdAt",
    durationMonths,
    terms,
  } = req.query;

  const queries = {};

  if (durationMonths) {
    queries.durationMonths = durationMonths;
  }

  if (terms) {
    queries.terms = { $regex: terms, $options: "i" };
  }

  const total = await Warrantie.countDocuments(queries);
  const totalPages = Math.ceil(total / limit);

  const warranties = await Warrantie.find(queries)
    .skip(Math.max(page - 1, 0) * limit)
    .limit(limit)
    .sort(sort)
    .populate({
      path: "productId",
      model: Product,
    });

  return res.json({
    success: true,
    mes: warranties.length
      ? "Lấy danh sách bảo hành thành công"
      : "Không tìm thấy chính sách bảo hành nào",
    data: warranties,
    pagination: {
      page: +page,
      limit: +limit,
      total: total,
      totalPages: totalPages,
    },
  });
};

module.exports = {
  addWarrantie,
  updateWarrantie,
  deleteWarrantie,
  getOne,
  getAll,
};
