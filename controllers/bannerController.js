const { v2 } = require("cloudinary");
const Banner = require("../models/banner");

const addBanner = async (req, res) => {
  const bannerRecord = await Banner.create({
    ...req.body,
    bannerPic: req.file.path,
  });
  const uploadResponse = await v2.uploader.upload(req.file.path, {
    public_id: `banner_${bannerRecord._id}`,
    overwrite: true,
    folder: "app/banner",
  });
  const updatedRecord = await Banner.findByIdAndUpdate(
    bannerRecord._id,
    {
      bannerPic: uploadResponse.secure_url,
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
const updateBanner = async (req, res) => {
  const uploadResponse = await v2.uploader.upload(req.file.path, {
    public_id: `banner_${req.params.id}`,
    overwrite: true,
    folder: "app/banner",
  });
  const response = await Banner.findByIdAndUpdate(
    req.params.id,
    { ...req.body, bannerPic: uploadResponse.secure_url },
    {
      new: true,
    }
  );
  return res.json({
    success: Boolean(response),
    mes: Boolean(response) ? "sửa thành công." : "loại banner không tồn tại.",
  });
};
const deleteBanner = async (req, res) => {
  const response = await Banner.findByIdAndDelete(req.params.id);
  return res.json({
    success: Boolean(response),
    mes: Boolean(response) ? "xóa thành công." : "loại banner không tồn tại.",
  });
};
const getAll = async (req, res) => {
  const { status } = req.query;
  const queries = {};
  if (status) queries.status = status;
  const response = await Banner.find(queries);
  return res.json({
    success: Boolean(response),
    mes: Boolean(response) ? "thành công." : "không có loại banner nào cả.",
    data: response,
  });
};

module.exports = { addBanner, updateBanner, deleteBanner, getAll };
