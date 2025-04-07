const User = require("../models/user");
const Product = require("../models/product");
const bcryptJs = require("bcryptjs");
const { generateToken, generateCode } = require("../utils/helper");
const { v2 } = require("../configs/cloudinary");
const sendEmail = require("../utils/sendEmail");

const signIn = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!Boolean(user))
    throw new Error("người dùng k tồn tại hoặc mật khẩu sai.");
  const isMatch = bcryptJs.compareSync(req.body.password, user.password);
  if (!Boolean(isMatch))
    throw new Error("người dùng k tồn tại hoặc mật khẩu sai.");

  generateToken({ id: user._id, role: user.role }, res);

  return res.json({
    success: Boolean(isMatch),
    message: Boolean(isMatch)
      ? "đăng nhập thành công"
      : "xảy ra một lỗi vui lòng thử lại!",
  });
};

const signUp = async (req, res) => {
  const alreadyUser = await User.exists({ email: req.body.email });

  if (Boolean(alreadyUser)) throw new Error("người dùng đã tồn tại.");

  const newUser = await User.create(req.body);

  return res.json({
    success: Boolean(newUser),
    message: Boolean(newUser)
      ? "tạo thành công"
      : "xảy ra 1 lỗi vui lòng thử lại",
  });
};

const updatedProfile = async (req, res) => {
  if (!req.file) throw new Error("cần truyền vào tập tin ảnh.");
  const uploadResponse = await v2.uploader.upload(req.file.path, {
    public_id: `user_${req.user.id}`,
    overwrite: true,
    folder: "app/user",
  });
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { ...req.body, profilePic: uploadResponse.secure_url },
    {
      new: true,
    }
  );
  return res.json({
    success: Boolean(updatedUser),
    message: Boolean(updatedUser)
      ? "cập nhật thông tin thành công."
      : "xảy ra một lỗi vui lòng thử lại!",
  });
};

const getCurrent = async (req, res) => {
  const user = await User.findById(req.user.id)
    .select("-password")
    .populate({ path: "cart", model: Product });
  return res.json({
    success: Boolean(user),
    message: Boolean(user) ? "thành công." : "thất bại.",
    data: user,
  });
};

const getOne = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  return res.json({
    success: Boolean(user),
    message: Boolean(user) ? "thành công." : "người dùng không tồn tại.",
    data: user,
  });
};

const getAll = async (req, res) => {
  const {
    limit = 10,
    page = 1,
    sort = "-createdAt",
    search = "",
    name,
    email,
    mobile,
    // role,
  } = req.query;

  const queries = {};

  if (name) queries.name = { $regex: new RegExp(name, "i") };
  if (email) queries.email = { $regex: new RegExp(email, "i") };
  if (mobile) queries.mobile = { $regex: new RegExp(mobile, "i") };
  // if (role) queries.role = { $regex: new RegExp(role, "i") };

  if (search) {
    queries.$or = [
      { name: { $regex: new RegExp(search, "i") } },
      { email: { $regex: new RegExp(search, "i") } },
      { mobile: { $regex: new RegExp(search, "i") } },
    ];
  }

  const total = await User.countDocuments(queries);
  const totalPages = Math.ceil(total / limit);

  const users = await User.find(queries)
    .select(["-password", "-forgotPassCode"])
    .skip(Math.round(Math.max(page - 1, 0)) * limit)
    .limit(limit)
    .sort(sort);

  return res.json({
    success: Boolean(users.length),
    message: Boolean(users.length)
      ? "Thành công."
      : "Không tìm thấy người dùng.",
    data: users,
    pagination: {
      page: +page,
      limit: +limit,
      total,
      totalPages,
    },
  });
};
const logOut = (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: process.env.NODE_ENV !== "development" ? "strict" : "lax",
  };

  res.clearCookie("jwt", cookieOptions);

  return res.status(200).json({
    success: true,
    message: "Đăng xuất thành công!",
  });
};

const createUserByAdmin = async (req, res) => {
  if (!req.file) throw new Error("cần truyền vào tập tin ảnh.");
  const alreadyUser = await User.exists({ email: req.body.email });
  if (Boolean(alreadyUser)) throw new Error("người dùng đã tồn tại !");
  const newUser = await User.create({ ...req.body, profilePic: req.file.path });

  const uploadResponse = await v2.uploader.upload(req.file.path, {
    public_id: `user_${newUser._id}`,
    overwrite: true,
    folder: "app/user",
  });
  const updatedRecord = await New.findByIdAndUpdate(
    newUser._id,
    {
      profilePic: uploadResponse.secure_url,
    },
    { new: true }
  );
  return res.json({
    success: Boolean(updatedRecord),
    message: Boolean(updatedRecord)
      ? "tạo thành công."
      : "xảy ra một lỗi vui lòng thử lại!",
  });
};
const updateUserByAdmin = async (req, res) => {
  if (!req.file) throw new Error("cần truyền vào tập tin ảnh.");
  const uploadResponse = await v2.uploader.upload(req.file.path, {
    public_id: `user_${req.params.id}`,
    overwrite: true,
    folder: "app",
  });
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { ...req.body, profilePic: uploadResponse.secure_url },
    {
      new: true,
    }
  );
  return res.json({
    success: Boolean(updatedUser),
    message: Boolean(updatedUser)
      ? "sửa người dùng thành công."
      : "xảy ra một lỗi vui lòng thử lại!",
  });
};

const deleteUserByAdmin = async (req, res) => {
  const deleteUser = await User.findByIdAndDelete(req.params.id);
  return res.json({
    success: Boolean(deleteUser),
    message: Boolean(deleteUser)
      ? "xóa thành công."
      : "người dùng không tồn tại!",
  });
};

const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!Boolean(user)) throw new Error("tài khoản không tồn tại.");
  const code = generateCode(6);
  user.forgotPassCode = code;
  await user.save();
  const html = `
  <div style="font-family: 'Google Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
    <div style="text-align: center; margin-bottom: 20px;">
      <span style="color: #4285F4; font-size: 24px; font-weight: bold;">Minhdental</span>
    </div>
    
    <h2 style="color: #202124; font-size: 20px; text-align: center;">Mã xác nhận của bạn</h2>
    
    <p style="color: #5F6368; font-size: 16px; text-align: center;">Sử dụng mã này để xác minh danh tính của bạn:</p>
    
    <div style="background: #F1F1F1; padding: 15px; text-align: center; margin: 20px 0; border-radius: 4px;">
      <span style="font-size: 28px; font-weight: bold; letter-spacing: 2px; color: #202124;">${code}</span>
    </div>
    
    <p style="color: #5F6368; font-size: 14px; text-align: center;">
      Mã này sẽ hết hạn sau 10 phút. Nếu bạn không yêu cầu mã này, bạn có thể bỏ qua email này.
    </p>
    
    <div style="border-top: 1px solid #e0e0e0; margin-top: 20px; padding-top: 20px;">
      <p style="color: #5F6368; font-size: 12px; text-align: center;">
        © ${new Date().getFullYear()} Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043
      </p>
    </div>
  </div>
`;

  const response = await sendEmail(req.body.email, "Lấy lại mật khẩu.", html);
  setTimeout(async () => {
    user.forgotPassCode = undefined;
    await user.save();
    console.log(`Đã xóa mã xác nhận của user ${email}`);
  }, 10 * 60 * 1000);

  return res.json({
    success: Boolean(response),
    message: Boolean(response)
      ? "vui lòng kiểm tra email của bạn."
      : "xảy ra một lỗi vui lòng thử lại",
  });
};

const resetPassword = async (req, res) => {
  const response = await User.updateOne({
    email: req.body.email,
    password: req.body.password,
  });
  return res.json({
    success: Boolean(response),
    message: Boolean(response)
      ? "lấy lại mật khẩu thành công."
      : "xảy ra một lỗi vui lòng thử lại.",
  });
};
const addOrRemoveFromCart = async (req, res) => {
  const { product } = req.body;
  const userId = req.user.id;

  const user = await User.findById(userId);
  const isProductInCart = user.cart.some(
    (item) => item.product.toString() === product.product
  );
  let update;
  let message;

  if (isProductInCart) {
    update = { $pull: { cart: { product: product.product } } };
    message = "Đã xóa sản phẩm khỏi giỏ hàng.";
  } else {
    update = { $push: { cart: product } };
    message = "Đã thêm sản phẩm vào giỏ hàng.";
  }

  const response = await User.findByIdAndUpdate(userId, update, { new: true });

  return res.json({
    success: Boolean(response),
    message: Boolean(response)
      ? message
      : "Cập nhật giỏ hàng thất bại. Vui lòng thử lại.",
    cart: response?.cart || [],
  });
};
module.exports = {
  signIn,
  signUp,
  updatedProfile,
  getCurrent,
  getOne,
  getAll,
  logOut,
  createUserByAdmin,
  updateUserByAdmin,
  deleteUserByAdmin,
  forgotPassword,
  resetPassword,
  addOrRemoveFromCart,
};
