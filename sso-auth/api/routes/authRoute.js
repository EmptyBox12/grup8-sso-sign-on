const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.route("/verifyToken").post(authController.isTokenValid);
router.route("/isAuthorized").post(authController.isAuthorized);

module.exports = router;
