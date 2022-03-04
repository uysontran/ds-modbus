const readModbus = require("../controller/readModbus.controller");
function router(app) {
  app.use("/:protocol", readModbus);
}
module.exports = router;
