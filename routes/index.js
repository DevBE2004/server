const {
  errorInternalServer,
  errorBadRequest,
} = require("../middlewares/errorHandler");
const userRoutes = require("./user");
const productRoutes = require("./product");
const paymentRoutes = require("./payment");
const warrantieRoutes = require("./warrantie");
const orderRoutes = require("./order");
const initRoutes = (app) => {
  app.use("/api/user", userRoutes);
  app.use("/api/product", productRoutes);
  app.use("/api/warrantie", warrantieRoutes);
  app.use("/api/order", orderRoutes);
  app.use("/api/payment", paymentRoutes);

  app.use(errorBadRequest);
  app.use(errorInternalServer);
};

module.exports = initRoutes;
