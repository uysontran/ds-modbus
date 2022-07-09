FROM tranuyson/cross-compiler:debian9.13 AS cc
COPY .. /tmp/ds-modbus
WORKDIR /tmp/ds-modbus
RUN npm run setup_armhf
RUN npm run build
WORKDIR /tmp/
RUN tar -zcvf DSmodbus.tar.gz ds-modbus
FROM scratch AS export-stage
COPY --from=cc /tmp/ds-modbus/dist/modbus modbus 
COPY --from=cc /tmp/DSmodbus.tar.gz modbus.tar.gz