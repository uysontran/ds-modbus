const debug = require("./src/utils/debug")("index");

require("./src/config/index")();

const app = require("express")();
require("./src/middleware/middleware.js")(app);
require("./src/routes/index.js")(app);

app.get("/serialport", async (req, res) => {
  const { SerialPort } = require("serialport");
  let list = await SerialPort.list();
  return res.send(list);
});
app.use("/status", (req, res) => {
  return res.sendStatus(200);
});
const port = process.env.PORT || 33336;
app.listen(port, () => {
  debug(`ds-modbus is running on ${port}`);
});
