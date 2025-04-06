const { verifyToken, isAdmin } = require("../middlewares/verifyToken");
const ctrl = require("../controllers/warrantieController");
const validateInfo = require("../middlewares/validateInfo");
const Joi = require("joi");
const { stringReq, numberReq } = require("../middlewares/joiSchema");
const router = require("express").Router();

router.post(
  "/add-warrantie",
  verifyToken,
  isAdmin,
  validateInfo(
    Joi.object({
      productId: stringReq,
      durationMonths: numberReq,
      terms: stringReq,
    })
  ),
  ctrl.addWarrantie
);
router.put(
  "/update-warrantie/:id",
  verifyToken,
  isAdmin,
  validateInfo(
    Joi.object({
      productId: stringReq,
      durationMonths: numberReq,
      terms: stringReq,
    })
  ),
  ctrl.updateWarrantie
);
router.delete(
  "/delete-warrantie/:id",
  verifyToken,
  isAdmin,
  ctrl.deleteWarrantie
);
router.get("/:id", ctrl.getOne);
router.get("", ctrl.getAll);

module.exports = router;
