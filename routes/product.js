const Joi = require("joi");
const validateInfo = require("../middlewares/validateInfo");
const { verifyToken, isAdmin } = require("../middlewares/verifyToken");
const {
  stringReq,
  numberReq,
  boolean,
  files,
} = require("../middlewares/joiSchema");
const { upload } = require("../configs/cloudinary");
const router = require("express").Router();
const ctrl = require("../controllers/productController");

router.post(
  "/add-product",
  verifyToken,
  isAdmin,
  upload.fields([
    {
      name: "productPics",
      maxCount: 5,
    },
  ]),
  validateInfo(
    Joi.object({
      productPics: files,
      title: stringReq,
      description: stringReq,
      category: stringReq,
      originalPrice: numberReq,
      salePrice: numberReq,
      quantity: numberReq,
      isLiquidation: boolean,
      directory: stringReq,
      isFeatured: boolean,
      brand: stringReq,
      origin: stringReq,
      introduce: stringReq,
    })
  ),
  ctrl.addProductByAdmin
);

router.put(
  "/update-product/:id",
  verifyToken,
  isAdmin,
  upload.fields([
    {
      name: "productPics",
      maxCount: 5,
    },
  ]),
  validateInfo(
    Joi.object({
      productPics: files,
      title: stringReq,
      description: stringReq,
      category: stringReq,
      originalPrice: numberReq,
      salePrice: numberReq,
      quantity: numberReq,
      isLiquidation: boolean,
      directory: stringReq,
      isFeatured: boolean,
      brand: stringReq,
      origin: stringReq,
      introduce: stringReq,
    })
  ),
  ctrl.updateProductByAdmin
);
router.delete(
  "/delete-product/:id",
  verifyToken,
  isAdmin,
  ctrl.deleteProductByAdmin
);
router.get("", ctrl.getAll);
router.get("/:id", ctrl.getOne);
module.exports = router;
