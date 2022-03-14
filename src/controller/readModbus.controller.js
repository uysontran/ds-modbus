const PQueue = require("p-queue");
const queue = new PQueue({ concurrency: 1 });
const { SerialPort } = require("serialport");
const Modbus = require("jsmodbus");
const { Buffer } = require("buffer");
const net = require("net");
const debug = require("../utils/debug")("readModbus");
module.exports = async function (req, res) {
  const {
    path,
    parse,
    parser,
    channel_name,
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
    port,
    gain = 1,
  } = req.body;
  try {
    let result = await queue.add(
      () =>
        new Promise((resolve, reject) => {
          const socket = (() => {
            if (req.params.protocol === "RTU") {
              return new SerialPort({
                path,
                baudRate: parseInt(baudRate),
                parity,
                stopBits,
                dataBits,
              });
            } else if (req.params.protocol === "TCP") {
              const child_socket = new net.Socket();
              child_socket.connect({ host, port });
              return child_socket;
            }
          })();
          const client = new Modbus.client[req.params.protocol](
            socket,
            parseInt(id)
          );

          socket.on(
            { RTU: "open", TCP: "connect" }[req.params.protocol],
            () => {
              switch (fc) {
                case "03":
                  client
                    .readHoldingRegisters(addr, quantity)
                    .then((result) => {
                      if (req.params.protocol === "RTU") {
                        socket.close();
                      } else {
                        socket.destroy();
                      }
                      let buf = Buffer.from(
                        result.response._body._valuesAsBuffer
                      );
                      let {
                        offset = 0,
                        byteLength = 8,
                        map = {},
                      } = JSON.parse(parser);

                      resolve({
                        [channel_name]:
                          map[buf[`read${parse}`](offset, byteLength) * gain] ||
                          buf[`read${parse}`](offset, byteLength) * gain,
                      });
                    })
                    .catch((err) => {
                      if (req.params.protocol === "RTU") {
                        socket.close();
                      } else {
                        socket.destroy();
                      }
                      reject(err);
                    });
                  break;
                default:
                  reject("function code not supported");
              }
            }
          );
          socket.on("error", (err) => {
            reject(err);
          });
        })
    );

    return res.send(result);
  } catch (err) {
    debug(err);
    switch (err.message) {
      case `Opening ${host}: Access denied`:
        return res.sendStatus(503);
        break;
      case "Req timed out":
        return res.sendStatus(408);
        break;
      case `Opening ${host}: File not found`:
        return res.sendStatus(404);
      default:
        return res.sendStatus(400);
    }
  }
};
