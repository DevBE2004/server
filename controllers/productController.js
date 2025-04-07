const Product = require("../models/product");
const { v2 } = require("../configs/cloudinary");
const { extractPublicId } = require("../utils/helper");

const addProductByAdmin = async (req, res) => {
  const files = req.files;
  if (!files) throw new Error("cần truyền vào những tập tin ảnh");
  const alreadyProduct = await Product.exists({ title: req.body.title });
  if (alreadyProduct) throw new Error("sản phẩm đã tồn tại.");

  const uploadPromises = files.productPics.map((file) =>
    v2.uploader.upload(file.path, {
      folder: "app/products",
    })
  );
  const uploadResults = await Promise.all(uploadPromises);
  const productPics = uploadResults.map((result) => result.secure_url);
  const response = await Product.create({
    ...req.body,
    productPics,
  });
  return res.json({
    success: Boolean(response),
    message: Boolean(response)
      ? "thêm thành công."
      : "xảy ra một lỗi vui lòng thử lại.",
  });
};
const updateProductByAdmin = async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);

  if (!product) throw new Error("sản phẩm không tồn tại.");

  if (req.files?.productPics && product.productPics?.length > 0) {
    const deletePromises = product.productPics.map((urlSecure) => {
      v2.uploader.destroy(extractPublicId(urlSecure));
    });
    await Promise.all(deletePromises);
  }
  let newImageUrls = [];
  if (req.files?.productPics) {
    const uploadResults = await Promise.all(
      req.files.productPics.map((file) =>
        v2.uploader.upload(file.path, {
          folder: "app/products",
        })
      )
    );
    newImageUrls = uploadResults.map((result) => result.secure_url);
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      ...req.body,
      productPics: newImageUrls.length > 0 ? newImageUrls : product.productPics,
    },
    { new: true }
  );

  return res.json({
    success: Boolean(updatedProduct),
    message: Boolean(updatedProduct)
      ? "cập nhật thành công"
      : "xảy ra một lỗi vui lòng thử lại",
  });
};
const deleteProductByAdmin = async (req, res) => {
  const response = await Product.findByIdAndDelete(req.params.id);
  return res.json({
    success: Boolean(response),
    message: Boolean(response)
      ? "xóa thành công"
      : "xảy ra một lỗi vui lòng thử lại",
  });
};

const getAll = async (req, res) => {
  const {
    limit = 10,
    page = 1,
    sort = "-createdAt",
    title,
    minPrice,
    maxPrice,
    priceType = "salePrice",
    search,
    directory,
    category,
  } = req.query;

  const queries = {};

  if (title) queries.title = { $regex: new RegExp(title, "i") };
  if (directory) queries.directory = directory;
  if (category) queries.category = category;

  if (search)
    queries.$or = [
      { title: { $regex: new RegExp(search, "i") } },
      { description: { $regex: new RegExp(search, "i") } },
    ];

  if (minPrice || maxPrice) {
    queries[priceType] = {};
    if (minPrice) {
      queries[priceType].$gte = Number(minPrice);
    }
    if (maxPrice) {
      queries[priceType].$lte = Number(maxPrice);
    }
  }

  const total = await Product.countDocuments(queries);
  const totalPages = Math.ceil(total / limit);

  const products = await Product.find(queries)
    .skip(Math.round(Math.max(page - 1, 0)) * limit)
    .limit(limit)
    .sort(sort);
  return res.json({
    success: Boolean(products.length),
    message: Boolean(products.length)
      ? "Thành công."
      : "Không tìm thấy sản phẩm.",
    data: products,
    pagination: {
      page: +page,
      limit: +limit,
      total,
      totalPages,
    },
  });
};

const getOne = async (req, res) => {
  const response = await Product.findById(req.params.id);
  return res.json({
    success: Boolean(response),
    message: Boolean(response) ? "thành công." : "sản phẩm không tồn tại.",
    data: response,
  });
};

module.exports = {
  addProductByAdmin,
  updateProductByAdmin,
  deleteProductByAdmin,
  getAll,
  getOne,
};
