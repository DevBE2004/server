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
    mes: Boolean(response)
      ? "sửa thành công."
      : "loại tin tức không tồn tại.",
  });
};
const deleteNew = async (req, res) => {
  const response = await New.findByIdAndDelete(req.params.id);
  return res.json({
    success: Boolean(response),
    mes: Boolean(response)
      ? "xóa thành công."
      : "loại tin tức không tồn tại.",
  });
};
const getAll = async (req, res) => {
  const response = await New.find();
  return res.json({
    success: Boolean(response),
    mes: Boolean(response)
      ? "thành công."
      : "không có loại tin tức nào cả.",
    data: response,
  });
};

module.exports = { addNew, updateNew, deleteNew, getAll };
