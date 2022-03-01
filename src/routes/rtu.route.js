const express = require("express");
const router = express.Router();
const controller = require("../controller/RTU.controller");
router.use("/", controller.rtu);

module.exports = router;
