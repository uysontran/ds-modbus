const Modbus = require("jsmodbus");
const net = require("net");
const PQueue = require("p-queue");
const queue = new PQueue({ concurrency: 1 });
function tcp(req) {
  const { host, port, id, fc, addr, quantity, value } = req.body;
  return new Promise((resovle, reject) => {
    const socket = new net.Socket();
    const client = new Modbus.client.TCP(socket, parseInt(id));
    socket.connect({ host, port });
    socket.on("connect", () => {
      switch (fc) {
        case "03":
          client
            .readHoldingRegisters(addr, quantity)
            .then((result) => {
              resovle(result);
              socket.destroy();
            })
            .catch((err) => {
              reject(err);
              socket.destroy();
            });
          break;
        default:
          console.log("function code not supported");
      }
    });
    socket.on("error", (err) => {
      reject(err);
    });
  });
}
class TCP {
  async tcp(req, res) {
    const { path, parse, parser, channel_name } = req.body;
    try {
      let result = await queue.add(() => tcp(req, res));
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
module.exports = new TCP();
