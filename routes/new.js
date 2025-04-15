const router = require("express").Router();
const ctrl = require("../controllers/newController");
const Joi = require("joi");
const validateInfo = require("../middlewares/validateInfo");
const { verifyToken, isAdmin } = require("../middlewares/verifyToken");
const { stringReq, file } = require("../middlewares/joiSchema");
const { upload } = require("../configs/cloudinary");
const category = require("../models/category");

router.post(
  "/add-new",
  verifyToken,
  isAdmin,
  upload.single("newPic"),
  validateInfo(
    Joi.object({
      title: stringReq,
      description: stringReq,
      status: stringReq,
      category: stringReq,
      newPic: file,
    })
  ),
  ctrl.addNew
);
router.put(
  "/update-new/:id",
  verifyToken,
  isAdmin,
  upload.single("newPic"),
  validateInfo(
    Joi.object({
      title: stringReq,
      description: stringReq,
      status: stringReq,
      category: stringReq,
      newPic: file,
    })
  ),
  ctrl.updateNew
);
router.delete(
  "/delete-new/:id",
  verifyToken,
  isAdmin,

  ctrl.deleteNew
);
router.get("", ctrl.getAll);

module.exports = router;
