const router = require("express").Router();
const ctrl = require("../controllers/directoryController");
const validateInfo = require("../middlewares/validateInfo");
const { verifyToken, isAdmin } = require("../middlewares/verifyToken");
const { category, stringReq } = require("../middlewares/joiSchema");

router.post(
  "/add-directory",
  verifyToken,
  isAdmin,
  validateInfo({
    title: stringReq,
    category,
  }),
  ctrl.addDirectory
);
router.put(
  "/update-directory/:id",
  verifyToken,
  isAdmin,
  validateInfo({
    title: stringReq,
    category,
  }),
  ctrl.updateDirectory
);
router.delete("/delete-directory/:id", ctrl.deleteDirectory);

router.get("", ctrl.getAll);

module.exports = router;
