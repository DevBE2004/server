const router = require("express").Router();
const ctrl = require("../controllers/directoryController");
const validateInfo = require("../middlewares/validateInfo");
const { verifyToken, isAdmin } = require("../middlewares/verifyToken");
const { category, stringReq, file } = require("../middlewares/joiSchema");
const { upload } = require("../configs/cloudinary");

router.post(
  "/add-directory",
  verifyToken,
  isAdmin,
  upload.single("directoryPic"),
  validateInfo({
    title: stringReq,
    category,
    directoryPic: file,
  }),
  ctrl.addDirectory
);
router.put(
  "/update-directory/:id",
  verifyToken,
  isAdmin,
  upload.single("directoryPic"),
  validateInfo({
    title: stringReq,
    category,
    directoryPic: file,
  }),
  ctrl.updateDirectory
);
router.delete(
  "/delete-directory/:id",
  verifyToken,
  isAdmin,
  ctrl.deleteDirectory
);

router.get("", ctrl.getAll);

module.exports = router;
