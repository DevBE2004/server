const router = require("express").Router();
const Joi = require("joi");
const ctrl = require("../controllers/orderController");
const validateInfo = require("../middlewares/validateInfo");
const { verifyToken } = require("../middlewares/verifyToken");
const { string, stringReq, products } = require("../middlewares/joiSchema");

router.post(
  "/add-order",
  verifyToken,
  validateInfo(
    Joi.object({
      products,
      status: string,
      orderBy: stringReq,
      address: stringReq,
    })
  ),
  ctrl.addOrder
);
router.put(
  "/update-order/:id",
  verifyToken,
  validateInfo(
    Joi.object({
      products,
      status: string,
      orderBy: stringReq,
      address: stringReq,
    })
  ),
  ctrl.updateOrder
);
router.delete("/delete-order/:id", verifyToken, ctrl.deleteOrder);
router.get("/:id", ctrl.getOne);
router.get("", ctrl.getAll);

module.exports = router;
