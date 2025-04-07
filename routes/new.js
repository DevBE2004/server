const router = require("express").Router();
const ctrl = require("../controllers/newController");
const Joi = require("joi");
const validateInfo = require("../middlewares/validateInfo");
const { verifyToken, isAdmin } = require("../middlewares/verifyToken");
const { stringReq } = require("../middlewares/joiSchema");
const { upload } = require("../configs/cloudinary");

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
