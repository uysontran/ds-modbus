const readModbus = require("../controller/readModbus.controller");
function router(app) {
  app.use("/action/:protocol", readModbus);
}
module.exports = router;
