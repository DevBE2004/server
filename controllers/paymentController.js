const momoConfig = require("../configs/momo");
const crypto = require("crypto");
const axios = require("axios");
const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");
const { generateOrderId } = require("../utils/helper");

const createPayment = async (req, res) => {
  try {
    const { amount, oId, products } = req.body;
    const orderId = generateOrderId();
    const orderInfo = products
      .map((p) => `${p.quantity}x ${p.product}`)
      .join(", ");

    const requestId = `${orderId}_${Date.now()}`;

    // Chuyển products thành JSON string để gửi qua extraData
    const extraData = JSON.stringify({
      products: products.map((p) => ({
        productId: p.product,
        quantity: p.quantity,
      })),
      orderBy: req.user.id,
      oId,
    });

    const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${momoConfig.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${momoConfig.partnerCode}&redirectUrl=${momoConfig.redirectUrl}&requestId=${requestId}&requestType=captureWallet`;

    const signature = crypto
      .createHmac("sha256", momoConfig.secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = {
      partnerCode: momoConfig.partnerCode,
      partnerName: "MINHDENTAL",
      storeId: "Your Store ID",
      requestId: requestId,
      amount: amount.toString(),
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: momoConfig.redirectUrl,
      ipnUrl: momoConfig.ipnUrl,
      lang: "vi",
      extraData: extraData,
      requestType: "captureWallet",
      signature: signature,
    };

    const response = await axios.post(momoConfig.endpoint, requestBody, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 10000,
    });

    res.json(response.data);
  } catch (error) {
    console.error("Payment error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      mes: "Payment creation failed",
      error: error.response?.data || error.message,
    });
  }
};

const returnByMomo = (req, res) => {
  // 1. Kiểm tra chữ ký (bắt buộc)
  if (!verifySignature(req.query, process.env.MOMO_SECRET_KEY)) {
    return res.status(403).send("Invalid signature");
  }

  // 2. Xử lý kết quả
  const { resultCode, orderId, amount } = req.query;

  if (resultCode === "0") {
    console.log(`Thanh toán thành công cho đơn hàng ${orderId}`);
    res.send(`
    <h1>Thanh toán thành công</h1>
    <p>Mã đơn hàng: ${orderId}</p>
    <p>Số tiền: ${amount} VND</p>
  `);
  } else {
    console.warn(`Thanh toán thất bại (Mã lỗi: ${resultCode})`);
    res.send("<h1>Thanh toán thất bại</h1>");
  }
};

const ipnMomo = async (req, res) => {
  // 1. Kiểm tra chữ ký
  if (!verifySignature(req.body, process.env.MOMO_SECRET_KEY))
    throw new Error("lỗi chữ kí momo.");
  // 2. Chỉ xử lý nếu thanh toán thành công (resultCode === "0")
  if (req.body.resultCode === "0") {
    try {
      let products = [];
      let orderBy;
      let oId;

      const extraData = JSON.parse(req.body.extraData);
      products = extraData.products || [];
      orderBy = extraData.orderBy;
      oId = extraData.oId;

      const orderPromise = Order.updateOne(
        { _id: oId },
        {
          status: "PAID",
          orderBy,
          orderIdMomo: req.body.orderId,
        }
      );
      const userPromise = User.findByIdAndUpdate(
        orderBy,
        { cart: [] },
        { new: true }
      );
      const productUpdates = products.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          console.error(`không tìm thấy sản phẩm: ${item.productId}`);
          return;
        }
        return Product.findByIdAndUpdate(
          item.productId,
          { $inc: { quantity: -item.quantity } },
          { new: true }
        );
      });

      await Promise.all([orderPromise, ...productUpdates, userPromise]);

      console.log(
        `Đã xác nhận đơn hàng ${req.body.orderId} qua IPN. Sản phẩm:`,
        products
      );
    } catch (error) {
      console.error("lỗi ở quá trình IPN:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  res.status(200).json({ mes: "IPN received" });
};

module.exports = { createPayment, returnByMomo, ipnMomo };
