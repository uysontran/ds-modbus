const rtu = require("./rtu.route");
const tcp = require("./tcp.route");
function router(app) {
  app.use("/rtu", rtu);
  app.use("/tcp", tcp);
}
module.exports = router;
