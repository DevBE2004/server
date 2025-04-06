const router = require("express").Router();
const ctrl = require("../controllers/paymentController");
const { verifyToken } = require("../middlewares/verifyToken");
const validateInfo = require("../middlewares/validateInfo");
const Joi = require("joi");
const { numberReq, products, stringReq } = require("../middlewares/joiSchema");

router.post(
  "/create-payment",
  verifyToken,
  validateInfo(
    Joi.object({
      amount: numberReq,
      oId: stringReq, //orderId (db)
      products,
    })
  ),
  ctrl.createPayment
);
router.get("/return", ctrl.returnByMomo);
router.post("/ipn", ctrl.ipnMomo);

module.exports = router;
