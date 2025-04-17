const { v2 } = require("cloudinary");
const Partner = require("../models/partner");

const addPartner = async (req, res) => {
  const partnerRecord = await Partner.create({
    partnerPic: req.file.path,
  });
  const uploadResponse = await v2.uploader.upload(req.file.path, {
    public_id: `partner_${partnerRecord._id}`,
    overwrite: true,
    folder: "app/partner",
  });
  const updatedRecord = await Partner.findByIdAndUpdate(
    partnerRecord._id,
    {
      partnerPic: uploadResponse.secure_url,
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
const updatePartner = async (req, res) => {
  const uploadResponse = await v2.uploader.upload(req.file.path, {
    public_id: `partner_${req.params.id}`,
    overwrite: true,
    folder: "app/partner",
  });
  const response = await Partner.findByIdAndUpdate(
    req.params.id,
    { partnerPic: uploadResponse.secure_url },
    {
      new: true,
    }
  );
  return res.json({
    success: Boolean(response),
    mes: Boolean(response) ? "sửa thành công." : "đối tác không tồn tại.",
  });
};
const deletePartner = async (req, res) => {
  const response = await Partner.findByIdAndDelete(req.params.id);
  return res.json({
    success: Boolean(response),
    mes: Boolean(response) ? "xóa thành công." : "đối tác không tồn tại.",
  });
};
const getAll = async (req, res) => {
  const queries = {};
  const response = await Partner.find(queries);
  return res.json({
    success: Boolean(response),
    mes: Boolean(response) ? "thành công." : "không có đối tác nào cả.",
    data: response,
  });
};

module.exports = { addPartner, updatePartner, deletePartner, getAll };
