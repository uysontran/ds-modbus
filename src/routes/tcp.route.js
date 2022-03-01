const express = require("express");
const router = express.Router();
const controller = require("../controller/TCP.controller");
router.use("/", controller.tcp);

module.exports = router;
