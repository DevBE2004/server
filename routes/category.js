const router = require("express").Router();
const Joi = require("joi");
const ctrl = require("../controllers/categoryController");
const validateInfo = require("../middlewares/validateInfo");
const { verifyToken, isAdmin } = require("../middlewares/verifyToken");
const { stringReq } = require("../middlewares/joiSchema");

router.post(
  "/add-category",
  verifyToken,
  isAdmin,
  validateInfo(
    Joi.object({
      title: stringReq,
    })
  ),
  ctrl.addCategory
);
router.put(
  "/update-category/:id",
  verifyToken,
  isAdmin,
  validateInfo(
    Joi.object({
      title: stringReq,
    })
  ),
  ctrl.updateCategory
);
router.delete(
  "/delete-category/:id",
  verifyToken,
  isAdmin,
  ctrl.deleteCategory
);
router.get("", ctrl.getAll);

module.exports = router;
