const router = require("express").Router();
const Joi = require("joi");
const ctrl = require("../controllers/userController");
const {
  stringReq,
  email,
  string,
  phone,
  product,
  file,
  products,
} = require("../middlewares/joiSchema");
const validateInfo = require("../middlewares/validateInfo");
const { verifyToken, isAdmin } = require("../middlewares/verifyToken");
const { upload } = require("../configs/cloudinary");

router.post(
  "/sign-up",
  validateInfo(
    Joi.object({
      email,
      name: stringReq,
      password: stringReq,
    })
  ),
  ctrl.signUp
);
router.post(
  "/sign-in",
  validateInfo(Joi.object({ email, password: stringReq })),
  ctrl.signIn
);
router.put(
  "/update-profile",
  verifyToken,
  upload.single("profilePic"),
  validateInfo(
    Joi.object({
      email,
      profilePic: file,
      name: stringReq,
      mobile: phone,
      address: string,
    })
  ),

  ctrl.updatedProfile
);
router.get("/log-out", verifyToken, ctrl.logOut);
router.get("/current", verifyToken, ctrl.getCurrent);
router.get("/:id", ctrl.getOne);
router.get("", ctrl.getAll);

router.post(
  "/add-user",
  verifyToken,
  isAdmin,
  upload.single("profilePic"),
  validateInfo(
    Joi.object({
      email,
      profilePic: file,
      name: stringReq,
      password: stringReq,
      mobile: phone,
      role: stringReq,
    })
  ),
  ctrl.createUserByAdmin
);
router.put(
  "/update-user/:id",
  verifyToken,
  isAdmin,
  upload.single("profilePic"),
  validateInfo(
    Joi.object({
      email,
      profilePic: file,
      name: stringReq,
      password: stringReq,
      mobile: phone,
      address: string,
      role: stringReq, //thêm dòng này
    })
  ),
  ctrl.updateUserByAdmin
);

router.delete("/delete-user/:id", verifyToken, isAdmin, ctrl.deleteUserByAdmin);

router.post(
  "/forgot-password",
  verifyToken,
  validateInfo(Joi.object({ email })),
  ctrl.forgotPassword
);
router.post(
  "/check-code",
  verifyToken,
  validateInfo(Joi.object({ email, code: stringReq })),
  ctrl.checkForgotPassCode
);
router.post(
  "/reset-password",
  verifyToken,
  validateInfo(Joi.object({ email, password: stringReq })),
  ctrl.resetPassword
);
router.put(
  "/add-to-cart",
  verifyToken,
  validateInfo(
    Joi.object({
      products,
    })
  ),
  ctrl.addToCart
);
router.put(
  "/remove-from-cart",
  verifyToken,
  validateInfo(
    Joi.object({
      pId: stringReq,
    })
  ),
  ctrl.removeFromCart
);
router.put("/clear-cart", verifyToken, ctrl.clearCart);
module.exports = router;
