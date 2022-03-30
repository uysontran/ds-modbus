const DEBUG = require("debug");
const debug = DEBUG("ds-modbus");
debug.log = console.log.bind(console);
DEBUG.enable("ds-modbus:*");
module.exports = function (type) {
  return (log) =>
    debug.extend(type)(`${process.memoryUsage().rss / (1024 * 1024)}: ${log}`);
};
