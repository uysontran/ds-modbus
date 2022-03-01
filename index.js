const express = require("express");
const app = express();
const port = process.env.PORT || 33336;
require("./src/config/index")();
require("./src/middleware/middleware.js")(app);
require("./src/routes/index.js")(app);
app.get("/serialport", async (req, res) => {
  let list = await SerialPort.list();
  return res.send(list);
});
app.use("/status", (req, res) => {
  return res.sendStatus(200);
});
app.listen(port, () => {
  console.log(`ds-modbus is running on ${port}`);
});
