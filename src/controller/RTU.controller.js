const PQueue = require("p-queue");
const queue = new PQueue({ concurrency: 1 });
const { SerialPort } = require("serialport");
const Modbus = require("jsmodbus");
function rtu(req, res) {
  const {
    host,
    id,
    fc,
    addr,
    quantity,
    value,
    baudRate,
    parity,
    stopBits,
    dataBits,
  } = req.body;
  return new Promise((resovle, reject) => {
    const socket = new SerialPort({
      path: host,
      baudRate: parseInt(baudRate),
      parity,
      stopBits,
      dataBits,
    });
    const client = new Modbus.client.RTU(socket, parseInt(id));
    socket.on("open", () => {
      switch (fc) {
        case "03":
          client
            .readHoldingRegisters(addr, quantity)
            .then((result) => {
              socket.close();
              resovle(result);
            })
            .catch((err) => {
              socket.close();
              reject(err);
            });
          break;
        default:
          socket.close();
          reject("function code not supported");
      }
    });
    socket.on("error", (err) => {
      reject(err);
    });
  });
}
class RTU {
  async rtu(req, res) {
    const { path } = req.body;
    try {
      let result = await queue.add(() => rtu(req, res));
      return res.send(result.response._body);
    } catch (err) {
      if (err.message === `Opening ${path}: Access denied`) {
        return res.sendStatus(503);
      } else {
        console.log(err);
        return res.sendStatus(404);
      }
    }
  }
}
module.exports = new RTU();
