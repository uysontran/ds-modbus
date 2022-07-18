# Introduction

ds-modbus stand for device service modbus. This service provide RESTfuls API to communicate with modbus devices.

## Feature:

- Faster read with auto grouping consecutives address register.
- Tranform data from raw buffer to its data type.
- ModbusRTU:

  - List serialport.
  - Command will exec faster by holding serial port opening. You can set holding time by setting env.

- ModbusTCP:

## Supported function:

- Read holding register (fc = 03)

# Usage
