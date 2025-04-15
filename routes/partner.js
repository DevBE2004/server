const router = require("express").Router();
const ctrl = require("../controllers/partnerController");
const Joi = require("joi");
const validateInfo = require("../middlewares/validateInfo");
const { verifyToken, isAdmin } = require("../middlewares/verifyToken");
const { stringReq, file } = require("../middlewares/joiSchema");
const { upload } = require("../configs/cloudinary");

router.post(
  "/add-partner",
  verifyToken,
  isAdmin,
  upload.single("partnerPic"),
  validateInfo(
    Joi.object({
      partnerPic: file,
    })
  ),
  ctrl.addPartner
);
router.put(
  "/update-partner/:id",
  verifyToken,
  isAdmin,
  upload.single("partnerPic"),
  validateInfo(
    Joi.object({
      partnerPic: file,
    })
  ),
  ctrl.updatePartner
);
router.delete("/delete-partner/:id", verifyToken, isAdmin, ctrl.deletePartner);
router.get("", ctrl.getAll);

module.exports = router;
