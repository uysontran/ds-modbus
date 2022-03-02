const PQueue = require("p-queue");
const queue = new PQueue({ concurrency: 1 });
const { SerialPort } = require("serialport");
const Modbus = require("jsmodbus");
const { Buffer } = require("buffer");
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
    const { path, parse, parser, channel_name } = req.body;
    try {
      let result = await queue.add(() => rtu(req, res));
      let buf = Buffer.from(result.response._body._valuesAsBuffer);
      if (parse === "key/value") {
        return res.send({
          [channel_name]:
            JSON.parse(parser)[result.response._body._values] ||
            result.response._body._values,
        });
      } else {
        return res.send({ [channel_name]: buf[`read${parse}`](0) });
      }
    } catch (err) {
      console.log(err.message);
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
