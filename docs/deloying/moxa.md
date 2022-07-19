## Connect to Moxa gateway

**On your linux computer**

1. Install minicom:
   ```bash
   sudo apt install minicom
   ```
2. Connect Moxa getway console port to computer
3. Find path to serial port
   ```bash
   sudo dmesg -wH
   ```
4. Config minicom
   ```bash
   sudo minicom -s
   ```
5. Select `Serial port setup`

6. Setup parameters

   Setup parameters like this table

   | Serial Console Settings |            |
   | :---------------------- | :--------- |
   | Baudrate                | 115200 bps |
   | Parity                  | None       |
   | Data bits               | 8          |
   | Stop bits               | 1          |
   | Flow Control            | None       |
   | Terminal                | VT100      |

7. Save setup as dfl
8. Exit from minicom
9. Access to console port
   ```bash
   sudo minicom
   ```
10. Login

    **User:** moxa

    **Password:** moxa

## Config ip address

1. Open configuration file

   ```bash
   sudo nano /etc/network/interfaces
   ```

2. Change parameters:

   | Parameter | Description              | Example         |
   | :-------- | :----------------------- | :-------------- |
   | address   | gateway static ip        | `192.168.1.127` |
   | netmarks  | subnet mark.             | `255.255.255.0` |
   | network   | first address network.   | `192.168.1.0`   |
   | broadcast | last address of network. | `192.168.1.255` |
   | gateway   | default gateway ip.      | `192.168.1.1`   |

3. Restart Network Service
   ```bash
   sudo systemctl restart networking
   ```
4. Test
   ```bash
   ping 8.8.8.8
   ```
   If ping not working, go back to step 1

## Allow non-root user access serialport

1. Add user to dialout group
   ```bash
   sudo usermod -a -G dialout $USER
   ```
2. Reboot
   ```bash
   sudo reboot
   ```

## Change default uart mode

1. Create mx-uart-ctl
   ```bash
   sudo ln -s /sbin/mx-uart-ctl /usr/local/bin/
   ```
   Warning: `mx-uart-ctl` will available to run as a non-root user
2. Create startup script
   ```bash
   sudo nano /usr/local/binstartup.sh
   ```
3. Copy these script
   ```bash
   #!/bin/sh
   mx-uart-ctl -p 0 -m 1
   ```
4. Allow startup.sh run directly from terminal
   ```bash
   sudo chmod +x /usr/local/bin/startup.sh
   ```
5. Create gateway service
   ```bash
   sudo nano /lib/systemd/system/gateway.service
   ```
6. Init gatwate.service

   ```
    [Unit]
    Description=Enable RS485 2-W Mode
    After=uc2100-base-system.service

    [Service]
    Type=oneshot
    ExecStart=/bin/bash startup.sh

    [Install]
    WantedBy=multi-user.target
   ```

7. Enable service on boot
   ```bash
   sudo systemctl enable gateway
   ```
8. Reboot
   ```bash
   sudo reboot
   ```

## Update glibc and glibcxx:

1. Check for glibc version
   ```bash
   ldd --version
   ```
2. Change source list

   ```bash
   sudo nano /etc/apt/sources.list
   ```

   Replace all `stretct` to `bullseye`

3. Update and install libc6
   ```bash
   sudo apt update
   sudo apt install libc6/bullseye libstdc++6/bullseye -y
   ```
   Some service ask for restart during installation process. Just choose yes
4. [!Importance] Change source list

   ```bash
   sudo nano /etc/apt/sources.list
   ```

   Replace all `bullseye` to `stretct`

   ```bash
   sudo apt update
   ```
