const Modbus = require("jsmodbus");
const net = require("net");
const PQueue = require("p-queue");
const queue = new PQueue({ concurrency: 1 });
function tcp(req, res) {
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
    try {
      let result = await queue.add(() => tcp(req, res));
      return res.json(result.response._body._values);
    } catch (err) {
      return res.sendStatus(404);
    }
  }
}
module.exports = new TCP();
