# Installation Guide

## Strong amd64/arm64/armhf machine

Run

```bash
npm install
```

## Weak armhf linux machine

There are two way to fast install on weak armhf linux machine

### 1 Use a stronger armhf machine

Run `npm install` on a stronger machine and copy project folder to the target machine. Note that you should use the same version of gcc and g++ of the target machine to avoid conflict.
Run `gcc -v` and `g++ -v` for more infomation

The fastest way to avoid conflict is use the same image of the target machine and run `npm install`

### 2 Make a cross compile

If you use amd64 or other architecture, you need to install arm-linux-gnueabihf to make a cross compile. It's recommended that you should download same version of arm-linux-gnueabihf with the target machine and change PATH varies to the directory, avoid to install arm-linux-gnueabihf via apt/apt-get or something else. After that just run npm run setup_armhf and copy project folder to target machine.

# Supported function:

03: Read Holding Register

# Supported DataType:

# Supported Method:

ModbusRTU

# Tested Device:

## Moxa UC-2101-LX:

    OS: Moxa Industrial Linux (Debian 9)
    Node Version: v16.15.1
    Processor: Armv7 Cortex-A8 600MHz
    DRAM: 256 DDR3

# To do:

Other modbus function support
Support modbus TCP
Support crosscompile using docker container
