const PQueue = require("p-queue");
const queue = new PQueue({ concurrency: 1 });
const { SerialPort } = require("serialport");
const Modbus = require("jsmodbus");
const { Buffer } = require("buffer");
const net = require("net");
const debug = require("../utils/debug");
module.exports = async function (req, res) {
  const {
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
  } = req.body;
  try {
    let result = await queue.add(
      () =>
        new Promise((resolve, reject) => {
          const socket = (() => {
            if (req.params.protocol === "RTU") {
              return new SerialPort({
                path: host,
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
                      resolve(result);
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
    debug(err.message);
    if (err.message === `Opening ${host}: Access denied`) {
      return res.sendStatus(503);
    } else {
      debug(err);
      return res.sendStatus(404);
    }
  }
};
