const express = require("express");
const router = express.Router();
const Authetification = require("../controllers/authController");
const upload = require("../middlewares/uploadMiddleware");

router.post(
  "/register",
  upload.fields([{ name: "image", maxCount: 1 }]),
  Authetification.createAccount
);

router.post("/login", Authetification.login);

module.exports = router;
