const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const authenticate = require("../middlewares/authMiddleware");
const productController = require("../controllers/productController");

router.post(
  "/",
  // authenticate,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  productController.addProduct
);

router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  productController.updateProduct
);

router.get("/:id", productController.getProduct);
// router.get("/getAllProducts", productController.getAllProducts);
// router.get("/products", productController.getProductsWithFilter);
router.get("/", productController.getProducts);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
