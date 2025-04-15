const Directory = require("../models/directory");
const Category = require("../models/category");
const { v2 } = require("cloudinary");
const addDirectory = async (req, res) => {
  const alreadyDiretory = await Directory.exists({ title: req.body.title });
  if (Boolean(alreadyDiretory)) throw new Error("loại sản phẩm đã tồn tại.");
  const newDirectory = await Directory.create({
    ...req.body,
    profilePic: req.file.path,
  });

  const uploadResponse = await v2.uploader.upload(req.file.path, {
    public_id: `directory_${newDirectory.id}`,
    overwrite: true,
    folder: "app/directory",
  });

  const response = await Directory.findByIdAndUpdate(
    newDirectory._id,
    {
      ...req.body,
      directoryPic: uploadResponse.secure_url,
    },
    { new: true }
  );
  return res.json({
    success: Boolean(response),
    mes: Boolean(response)
      ? "thêm thành công."
      : "xảy ra một lỗi vui lòng thử lại.",
  });
};
const updateDirectory = async (req, res) => {
  const uploadResponse = await v2.uploader.upload(req.file.path, {
    public_id: `directory_${req.params.id}`,
    overwrite: true,
    folder: "app/directory",
  });
  const response = await Directory.findByIdAndUpdate(
    req.params.id,
    { ...req.body, directoryPic: uploadResponse.secure_url },
    {
      new: true,
    }
  );
  return res.json({
    success: Boolean(response),
    mes: Boolean(response) ? "sửa thành công." : "danh mục không tồn tại",
  });
};
const deleteDirectory = async (req, res) => {
  const response = await Directory.findByIdAndDelete(req.params.id);
  return res.json({
    success: Boolean(response),
    mes: Boolean(response) ? "xóa thành công." : "danh mục không tồn tại.",
  });
};
const getAll = async (req, res) => {
  const response = await Directory.find().populate({
    path: "category",
    model: Category,
  });
  return res.json({
    success: Boolean(response),
    mes: Boolean(response) ? "thành công." : "không có danh mục.",
    data: response,
  });
};

module.exports = { addDirectory, updateDirectory, deleteDirectory, getAll };
