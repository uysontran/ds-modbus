# Introduction

ds-modbus stand for device service modbus. This service provide RESTfuls API to communicate with modbus devices.

## Feature:

- Faster read with auto grouping consecutives address register.
- Tranform data from raw buffer to its data type.
- ModbusRTU:

  - List serialport.
  - modbus commands will exec faster by holding serial port opening. You can set holding time by setting env.

- ModbusTCP:

## Supported function:

- Read holding register (fc = 03)

# Requirement:

## Development enviroment:

- node v14 lts or above
- [optional] docker for build executable file
- [not sure] gcc, g++, make

## Production enviroment

# Installation Guide

## Development enviroment:

```bash
npm run setup
```

## Production enviroment:

Change target attribute of pkg property in package.json

```json
    "targets": [
      "node16-[os]-[target]"
    ],
```

Then run

```bash
npm run build
```

### Output:

Output file will be placed at dist folder.

There are two file will be exported:

- executable file: You can run this file without installling node js
- .tar.gz: the compressed project folder, you can run app after uncompressed this file with `node index.js` command in case of executable can not run. However, nodejs is required.

### OS list:

- linux

### Target list:

- armv7

# APIs:

## Status:

### Request:

- URL:

  ```http
  GET /status
  ```

### Responce:

| Status | Body | Description          |
| :----- | :--- | :------------------- |
| 200    |      | ds-modbus is running |

## Serial Port:

### Request:

- URL:

  ```http
  GET /RTU/SerialPort
  ```

### Responce:

| Status | Body    | Description      |
| :----- | :------ | :--------------- |
| 200    | `array` | Serial Port list |

- Body:

  ```javascript
  [
    {
      path: string,
      manufacturer: string,
      pnpId: string,
      vendorId: string,
      productionId: string,
    },...
  ];
  ```

## Modbus RTU:

### Request:

- url:

  ```http
  POST /RTU
  ```

  | Property  | Description           |
  | :-------- | :-------------------- |
  | slaveID   |                       |
  | path      | path to serial port   |
  | baudRate  |                       |
  | parity    | `none`, `even`, `odd` |
  | stopBits  | `8`                   |
  | startBits | `1`, `1.5`, `2`       |
  | channels  | array of channels     |
  | other     | other property        |

  **Channels:**

  ```javascript
  [
    {
      name: string,
      addr: number,
      dataType: string,
      fc: string, // `03`
    },
  ];
  ```
