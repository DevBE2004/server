const { v2 } = require("cloudinary");
const New = require("../models/new");

const addNew = async (req, res) => {
  const newRecord = await New.create({
    ...req.body,
    newPic: req.file.path,
  });
  const uploadResponse = await v2.uploader.upload(req.file.path, {
    public_id: `new_${newRecord._id}`,
    overwrite: true,
    folder: "app/new",
  });
  const updatedRecord = await New.findByIdAndUpdate(
    newRecord._id,
    {
      newPic: uploadResponse.secure_url,
    },
    { new: true }
  );
  return res.json({
    success: Boolean(updatedRecord),
    mes: Boolean(updatedRecord)
      ? "thêm thành công."
      : "xảy ra một lỗi vui lòng thử lại.",
  });
};
const updateNew = async (req, res) => {
  const uploadResponse = await v2.uploader.upload(req.file.path, {
    public_id: `new_${req.params.id}`,
    overwrite: true,
    folder: "app/new",
  });
  const response = await New.findByIdAndUpdate(
    req.params.id,
    { ...req.body, newPic: uploadResponse.secure_url },
    {
      new: true,
    }
  );
  return res.json({
    success: Boolean(response),
    mes: Boolean(response) ? "sửa thành công." : "loại tin tức không tồn tại.",
  });
};
const deleteNew = async (req, res) => {
  const response = await New.findByIdAndDelete(req.params.id);
  return res.json({
    success: Boolean(response),
    mes: Boolean(response) ? "xóa thành công." : "loại tin tức không tồn tại.",
  });
};
const getAll = async (req, res) => {
  const {
    page = 1,
    sort = "-createdAt",
    limit = 10,
    title,
    category,
    search,
    description,
    status,
  } = req.query;
  const queries = {};
  if (title) queries.title = { $regex: new RegExp(title, "i") };
  if (status) queries.status = status;
  if (category) queries.category = { $regex: new RegExp(category, "i") };
  if (description)
    queries.description = { $regex: new RegExp(description, "i") };
  if (search) {
    queries.$or = [
      { title: { $regex: new RegExp(search, "i") } },
      { description: { $regex: new RegExp(search, "i") } },
      { category: { $regex: new RegExp(search, "i") } },
    ];
  }

  const total = await New.countDocuments(queries);
  const totalPages = Math.ceil(total / limit);
  const news = await New.find()
    .skip(Math.round(Math.max(page - 1, 0)) * limit)
    .limit(limit)
    .sort(sort);

  return res.json({
    success: Boolean(news),
    mes: Boolean(news) ? "thành công." : "không có loại tin tức nào cả.",
    data: news,
    pagination: {
      page: +page,
      limit: +limit,
      total,
      totalPages,
    },
  });
};

module.exports = { addNew, updateNew, deleteNew, getAll };
