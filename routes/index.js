const {
  errorInternalServer,
  errorBadRequest,
} = require("../middlewares/errorHandler");
const userRoutes = require("./user");
const productRoutes = require("./product");
const paymentRoutes = require("./payment");
const warrantieRoutes = require("./warrantie");
const orderRoutes = require("./order");
const categoryRoutes = require("./category");
const directoryRoutes = require("./directory");
const newRoutes = require("./new");
const bannerRoutes = require('./banner')

const initRoutes = (app) => {
  app.use("/api/user", userRoutes);
  app.use("/api/product", productRoutes);
  app.use("/api/warrantie", warrantieRoutes);
  app.use("/api/order", orderRoutes);
  app.use("/api/category", categoryRoutes);
  app.use("/api/directory", directoryRoutes);
  app.use("/api/payment", paymentRoutes);
  app.use("/api/new", newRoutes);
  app.use("/api/banner", bannerRoutes);

  app.use(errorBadRequest);
  app.use(errorInternalServer);
};

module.exports = initRoutes;
