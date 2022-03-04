const DEBUG = require("debug");
const debug = DEBUG("ds-modbus");
debug.log = console.log.bind(console);
DEBUG.enable("ds-modbus:*");
module.exports = function (type) {
  return debug.extend(type);
};
