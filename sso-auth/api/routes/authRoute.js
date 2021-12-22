const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.route("/verifyToken/:url?").post(authController.isTokenValid);
router.route("/isAuthorized/:redirectURL?").post(authController.isAuthorized);

module.exports = router;
