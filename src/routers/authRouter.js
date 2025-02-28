const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");

router.post("/sign-up", authController.signUp);
router.post("/sign-in", authController.signIn);
router.post("/log-out", authController.logOut);
router.patch("/send-verification-code", authController.sendVerificationCode);
module.exports = router;
