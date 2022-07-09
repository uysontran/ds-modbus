interface ModbusOption {
  path?: String;
  baudRate?:
    | 110
    | 300
    | 1200
    | 2400
    | 4800
    | 9600
    | 14400
    | 19200
    | 38400
    | 57600
    | 115200;
  dataBits?: 5 | 6 | 7 | 8;
  stopBits?: 1 | 1.5 | 2;

  host?: String;
  port?: String;

  slaveID: Number;
}
interface ModbusChannel {
  name: String;
  addr: Number;
  dataType:
    | "BigInt64BE"
    | "BigInt64LE"
    | "BigUInt64BE"
    | "BigUInt64LE"
    | "DoubleBE"
    | "DoubleLE"
    | "FloatBE"
    | "FloatLE"
    | "Int32BE"
    | "Int32LE"
    | "UInt32BE"
    | "UInt32LE"
    | "Int16BE"
    | "Int16LE"
    | "UInt16BE"
    | "UInt16LE";
  precision: Number;
}
interface channels {
  [channel_name]: Number;
}
