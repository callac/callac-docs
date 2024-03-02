
# Keepalived

## Keepalived简介

> keepalived是集群管理中保证集群高可用的一个服务软件，它的作用是检测web服务器的状态。
> 
> 如果有一台服务器死机，或工作出现故障，keepalived将检测到，并将有故障的服务器从系统中剔除，当web服务器工作正常后，自动将web服务器加入到服务器集群中。解决了静态路由的单点故障问题。


## docker-compose 实现VIP+Nginx实现反向代理

### docker-compose

> 使用时，需要提前给 [generate.sh](#generate.sh) 赋予可执行权限(`chmod +x keepalived/generate.sh`)，如果是单个Keepalived跑，不需要执行赋予权限的操作。

```
version: '3'

services:
  keepalived:
    image: osixia/keepalived:2.0.20
    container_name: keepalived
    network_mode: host
    depends_on:
      - nginx
    cap_add:
      - NET_ADMIN
    environment:
      - KEEPALIVED_CONFIG_NAME=nginx
      # #每个虚拟路由器惟一标识，范围：0-255，同一组虚拟路由器的vrid必须一致
      - KEEPALIVED_VIRTUAL_ROUTER_ID=56
      - AUTH_PASSWORD=lTybR9jZ47l5FYfDSgEW
      - KEEPALIVED_PRIORITY=101
      - CHECK_IP=127.0.0.1
      - CHECK_PORT=80

      # 迁移环境后，以下参数必须要改
      - KEEPALIVED_INTERFACE=ens18
      - KEEPALIVED_VIRTUAL_IPS=192.168.252.13
      - KEEPALIVED_UNICAST_PEERS=192.168.252.12 192.168.252.14      
    volumes:
      - /lib/modules:/lib/modules
      - ./keepalived:/etc/keepalived
    command: ["/bin/bash", "-c", "/etc/keepalived/generate.sh"]
    restart: on-failure
    logging:
      options:
        max-size: "10m"
        max-file: "5"

  nginx:
    image: nginx:1.25-alpine
    container_name: nginx
    ports:
      - "80:80"
    restart: on-failure
    logging:
      options:
        max-size: "10m"
        max-file: "5"

  keepalivedBackend:
    image: osixia/keepalived:2.0.20
    container_name: keepalivedBackend
    network_mode: host
    depends_on:
      - nginx
    cap_add:
      - NET_ADMIN
    environment:
      - KEEPALIVED_CONFIG_NAME=backend
      # #每个虚拟路由器惟一标识，范围：0-255，同一组虚拟路由器的vrid必须一致
      - KEEPALIVED_VIRTUAL_ROUTER_ID=57
      - AUTH_PASSWORD=tK4A8XeFhNoacfQkoQAR
      - KEEPALIVED_PRIORITY=101
      - CHECK_IP=127.0.0.1
      - CHECK_PORT=80

      # 迁移环境后，以下参数必须要改
      - KEEPALIVED_INTERFACE=ens18
      - KEEPALIVED_VIRTUAL_IPS=192.168.252.15
      - KEEPALIVED_UNICAST_PEERS=192.168.252.12 192.168.252.14      
    volumes:
      - /lib/modules:/lib/modules
      - ./keepalived:/etc/keepalived
    command: ["/bin/bash", "-c", "/etc/keepalived/generate.sh"]
    restart: on-failure
    logging:
      options:
        max-size: "10m"
        max-file: "5"
```

### check_port.sh.template
```
#!/bin/bash

# Check port
nc -z -w 1 {{ CHECK_IP }} {{ CHECK_PORT }}
```
### keepalived.conf.template
```
global_defs {
    router_id {{ KEEPALIVED_CONFIG_NAME }}
}

vrrp_script check_port {
    script "/etc/keepalived/check_port_{{ KEEPALIVED_CONFIG_NAME }}.sh"
    interval 1
    fall 3
    rise 2
}

vrrp_instance VI_1 {
    interface {{ KEEPALIVED_INTERFACE }}
    state MASTER
    virtual_router_id {{ KEEPALIVED_VIRTUAL_ROUTER_ID }}
    priority {{ KEEPALIVED_PRIORITY }}
    advert_int 1
    authentication {
        auth_type PASS
        auth_pass {{ AUTH_PASSWORD }}
    }
    virtual_ipaddress {
        {{ KEEPALIVED_VIRTUAL_IPS }}
    }
    track_script {
        check_port
    }
}
```

### <a id="generate.sh">generate.sh</a>

> 这里有个问题，就是这个 generate.sh 需要先手动赋予可执行权限，不然多个Keepalived同时启用，有点问题

```
#!/bin/bash

# 检查模板文件是否存在
if [ ! -f /etc/keepalived/keepalived.conf.template ] || [ ! -f /etc/keepalived/check_port.sh.template ]; then
  echo "Template file /etc/keepalived/keepalived.conf.template or /etc/keepalived/check_port.sh.template not found."
  exit 1
fi

# 填充模板文件
sed -e "s|{{ KEEPALIVED_INTERFACE }}|$KEEPALIVED_INTERFACE|g" \
    -e "s|{{ KEEPALIVED_VIRTUAL_ROUTER_ID }}|$KEEPALIVED_VIRTUAL_ROUTER_ID|g" \
    -e "s|{{ KEEPALIVED_PRIORITY }}|$KEEPALIVED_PRIORITY|g" \
    -e "s|{{ AUTH_PASSWORD }}|$AUTH_PASSWORD|g" \
    -e "s|{{ KEEPALIVED_VIRTUAL_IPS }}|$KEEPALIVED_VIRTUAL_IPS|g" \
    -e "s|{{ KEEPALIVED_CONFIG_NAME }}|$KEEPALIVED_CONFIG_NAME|g" \
    /etc/keepalived/keepalived.conf.template > /etc/keepalived/keepalived_$KEEPALIVED_CONFIG_NAME.conf

sed -e "s|{{ CHECK_PORT }}|$CHECK_PORT|g" \
    -e "s|{{ CHECK_IP }}|$CHECK_IP|g" \
    /etc/keepalived/check_port.sh.template > /etc/keepalived/check_port_$KEEPALIVED_CONFIG_NAME.sh

chmod +x /etc/keepalived/check_port_$KEEPALIVED_CONFIG_NAME.sh


# tail -f /dev/null
# 启动 Keepalived
exec keepalived -n -f /etc/keepalived/keepalived_${KEEPALIVED_CONFIG_NAME}.conf

```