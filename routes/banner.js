const router = require("express").Router();
const ctrl = require("../controllers/bannerController");
const Joi = require("joi");
const validateInfo = require("../middlewares/validateInfo");
const { verifyToken, isAdmin } = require("../middlewares/verifyToken");
const { stringReq, file } = require("../middlewares/joiSchema");
const { upload } = require("../configs/cloudinary");

router.post(
  "/add-banner",
  verifyToken,
  isAdmin,
  upload.single("bannerPic"),
  validateInfo(
    Joi.object({
      status: stringReq,
      bannerPic: file,
      url: stringReq,
    })
  ),
  ctrl.addBanner
);
router.put(
  "/update-banner/:id",
  verifyToken,
  isAdmin,
  upload.single("bannerPic"),
  validateInfo(
    Joi.object({
      status: stringReq,
      bannerPic: file,
      url: stringReq,
    })
  ),
  ctrl.updateBanner
);
router.delete("/delete-banner/:id", verifyToken, isAdmin, ctrl.deleteBanner);
router.get("", ctrl.getAll);

module.exports = router;
