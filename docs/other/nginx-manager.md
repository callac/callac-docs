# Nginx Proxy 可视化管理界面


提到Nginx很多运维人员又是喜欢又是愁。喜欢是因为功能强大，性能强，愁的是配置管理确实复杂了点。很多新手第一次接触Nginx都会被其各种复杂的配置项搞得头疼，什么 location、什么 upstream，傻傻分不清楚。比如一个简单的单层反向代理 /api 配置：

```

http {
    server {
        listen 80;

        location /api {
            proxy_pass http://backend_server:8080;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location / {
            # 这里可以配置静态文件服务或其他路径的处理
        }
    }
}
```
上述代码只是单层反向代理，如果涉及多台反向代理，配置更为复杂，如下：

```
# 第一层反向代理配置
server {
    listen 80;
    server_name proxy1.example.com;

    location / {
        proxy_pass http://proxy2.example.com; # 转发到第二层代理
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        # 其他可能需要的proxy_set_header配置
    }
}

# 第二层反向代理配置
server {
    listen 80;
    server_name proxy2.example.com;

    location / {
        proxy_pass http://final-destination.example.com; # 最终服务器
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        # 其他可能需要的proxy_set_header配置
    }
}

# 最终服务器配置
server {
    listen 80;
    server_name final-destination.example.com;

    location / {
        # 最终处理请求的配置
    }
}
```

在上面的多层反向代理配置中，请求到第一层代理proxy1.example.com，然后由proxy1转发请求到第二层代理proxy2.example.com，最后由proxy2转发请求到最终服务器final-destination.example.com。每层代理都必须正确地设置X-Real-IP和X-Forwarded-For，如果出现任何的配置错误，那么就会导致Nginx运行失败。

那么有没有什么办法快速学习会Nginx，同时降低Nginx配置的复杂度呢，答案是有的。第一种：脑袋聪明图片，一学就会的Nginx大神图片，那么什么复杂问题都不是问题了。很显然，小编不是这种脑袋聪明的，但是小编会“偷懒”。所以，选择了第二种，Nginx可视化管理界面：nginx-proxy-manager

### nginx-proxy-manager 介绍 

一句话介绍nginx-proxy-manager：为用户提供简单而强大的Nginx Proxy可视化管理界面，降低学习和配置门槛

### 项目信息

```
# Github地址
https://github.com/NginxProxyManager/nginx-proxy-manager
# 项目网站地址
https://nginxproxymanager.com/
```

### 功能特性

> 基于 Tabler 的美观、安全的可视化管理界面

> 无需了解 Nginx 即可轻松创建管理代理、重定向、streams 和 404 

> 基于 Let's Encrypt 支持免费 SSL  证书和支持用户自定义 SSL 证书

> 主机的访问列表管理和基本 HTTP 身份验证

> 为管理员提供更高级 Nginx 配置

> 用户管理、权限和审计操作日志

### nginx-proxy-manager 安装

> 具备docker和docker-compose环境

 - 创建docker-compose.yml文件

```
version: '3.8'
services:
  app:
    image: 'docker.io/jc21/nginx-proxy-manager:latest'
    restart: unless-stopped
    ports:
      - '80:80'
      - '81:81'
      - '443:443'
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt

```
- 启动服务

``` 
docker-compose up -d
```

部署完成后，通过浏览器访问：http://hostip:81 打开nginx-proxy-manager界面，账号密码

```
Email:    admin@example.com
Password: changeme
```

### nginx-proxy-manager 使用 

一. 创建proxy host

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202404180907322.png)

+ 域名：域名就是反向代理使用的域名

+ 协议：依据后续服务协议，选择http或者https

+ 转发主机/IP：后端服务地址

+ 转发端口：后端服务端口。

+ 缓存资源、阻断常见漏洞、支持 WebSockets 三个依据服务需求自行选择

+ 自定义location

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202404180908467.png)

配置SSL

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202404180908616.png)

高级配置

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202404180908593.png)

配置完成后，在【Hosts】界面显示主机清单

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202404191013385.png)

二、创建重定向

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202404180918657.png)

+ 配置重定向SSL

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202404180921601.png)

+ 自定义高级配置

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202404180921149.png)

三、配置Stream

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202404181057705.png)

四、配置404

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202404181103985.png)

五、配置访问控制

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202404181108923.png)
