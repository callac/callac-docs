import{_ as s,c as n,o as a,N as e}from"./chunks/framework.a5f3ff40.js";const d=JSON.parse('{"title":"Keepalived","description":"","frontmatter":{},"headers":[],"relativePath":"other/keepalived-虚拟VIP.md"}'),l={name:"other/keepalived-虚拟VIP.md"},p=e(`<h1 id="keepalived" tabindex="-1">Keepalived <a class="header-anchor" href="#keepalived" aria-label="Permalink to &quot;Keepalived&quot;">​</a></h1><h2 id="keepalived简介" tabindex="-1">Keepalived简介 <a class="header-anchor" href="#keepalived简介" aria-label="Permalink to &quot;Keepalived简介&quot;">​</a></h2><blockquote><p>keepalived是集群管理中保证集群高可用的一个服务软件，它的作用是检测web服务器的状态。</p><p>如果有一台服务器死机，或工作出现故障，keepalived将检测到，并将有故障的服务器从系统中剔除，当web服务器工作正常后，自动将web服务器加入到服务器集群中。解决了静态路由的单点故障问题。</p></blockquote><h2 id="docker-compose-实现vip-nginx实现反向代理" tabindex="-1">docker-compose 实现VIP+Nginx实现反向代理 <a class="header-anchor" href="#docker-compose-实现vip-nginx实现反向代理" aria-label="Permalink to &quot;docker-compose 实现VIP+Nginx实现反向代理&quot;">​</a></h2><h3 id="docker-compose" tabindex="-1">docker-compose <a class="header-anchor" href="#docker-compose" aria-label="Permalink to &quot;docker-compose&quot;">​</a></h3><blockquote><p>使用时，需要提前给 <a href="#generate-sh">generate.sh</a> 赋予可执行权限(<code>chmod +x keepalived/generate.sh</code>)，如果是单个Keepalived跑，不需要执行赋予权限的操作。</p></blockquote><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">version: &#39;3&#39;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">services:</span></span>
<span class="line"><span style="color:#A6ACCD;">  keepalived:</span></span>
<span class="line"><span style="color:#A6ACCD;">    image: osixia/keepalived:2.0.20</span></span>
<span class="line"><span style="color:#A6ACCD;">    container_name: keepalived</span></span>
<span class="line"><span style="color:#A6ACCD;">    network_mode: host</span></span>
<span class="line"><span style="color:#A6ACCD;">    depends_on:</span></span>
<span class="line"><span style="color:#A6ACCD;">      - nginx</span></span>
<span class="line"><span style="color:#A6ACCD;">    cap_add:</span></span>
<span class="line"><span style="color:#A6ACCD;">      - NET_ADMIN</span></span>
<span class="line"><span style="color:#A6ACCD;">    environment:</span></span>
<span class="line"><span style="color:#A6ACCD;">      - KEEPALIVED_CONFIG_NAME=nginx</span></span>
<span class="line"><span style="color:#A6ACCD;">      # #每个虚拟路由器惟一标识，范围：0-255，同一组虚拟路由器的vrid必须一致</span></span>
<span class="line"><span style="color:#A6ACCD;">      - KEEPALIVED_VIRTUAL_ROUTER_ID=56</span></span>
<span class="line"><span style="color:#A6ACCD;">      - AUTH_PASSWORD=lTybR9jZ47l5FYfDSgEW</span></span>
<span class="line"><span style="color:#A6ACCD;">      - KEEPALIVED_PRIORITY=101</span></span>
<span class="line"><span style="color:#A6ACCD;">      - CHECK_IP=127.0.0.1</span></span>
<span class="line"><span style="color:#A6ACCD;">      - CHECK_PORT=80</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">      # 迁移环境后，以下参数必须要改</span></span>
<span class="line"><span style="color:#A6ACCD;">      - KEEPALIVED_INTERFACE=ens18</span></span>
<span class="line"><span style="color:#A6ACCD;">      - KEEPALIVED_VIRTUAL_IPS=192.168.252.13</span></span>
<span class="line"><span style="color:#A6ACCD;">      - KEEPALIVED_UNICAST_PEERS=192.168.252.12 192.168.252.14      </span></span>
<span class="line"><span style="color:#A6ACCD;">    volumes:</span></span>
<span class="line"><span style="color:#A6ACCD;">      - /lib/modules:/lib/modules</span></span>
<span class="line"><span style="color:#A6ACCD;">      - ./keepalived:/etc/keepalived</span></span>
<span class="line"><span style="color:#A6ACCD;">    command: [&quot;/bin/bash&quot;, &quot;-c&quot;, &quot;/etc/keepalived/generate.sh&quot;]</span></span>
<span class="line"><span style="color:#A6ACCD;">    restart: on-failure</span></span>
<span class="line"><span style="color:#A6ACCD;">    logging:</span></span>
<span class="line"><span style="color:#A6ACCD;">      options:</span></span>
<span class="line"><span style="color:#A6ACCD;">        max-size: &quot;10m&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">        max-file: &quot;5&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  nginx:</span></span>
<span class="line"><span style="color:#A6ACCD;">    image: nginx:1.25-alpine</span></span>
<span class="line"><span style="color:#A6ACCD;">    container_name: nginx</span></span>
<span class="line"><span style="color:#A6ACCD;">    ports:</span></span>
<span class="line"><span style="color:#A6ACCD;">      - &quot;80:80&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">    restart: on-failure</span></span>
<span class="line"><span style="color:#A6ACCD;">    logging:</span></span>
<span class="line"><span style="color:#A6ACCD;">      options:</span></span>
<span class="line"><span style="color:#A6ACCD;">        max-size: &quot;10m&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">        max-file: &quot;5&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  keepalivedBackend:</span></span>
<span class="line"><span style="color:#A6ACCD;">    image: osixia/keepalived:2.0.20</span></span>
<span class="line"><span style="color:#A6ACCD;">    container_name: keepalivedBackend</span></span>
<span class="line"><span style="color:#A6ACCD;">    network_mode: host</span></span>
<span class="line"><span style="color:#A6ACCD;">    depends_on:</span></span>
<span class="line"><span style="color:#A6ACCD;">      - nginx</span></span>
<span class="line"><span style="color:#A6ACCD;">    cap_add:</span></span>
<span class="line"><span style="color:#A6ACCD;">      - NET_ADMIN</span></span>
<span class="line"><span style="color:#A6ACCD;">    environment:</span></span>
<span class="line"><span style="color:#A6ACCD;">      - KEEPALIVED_CONFIG_NAME=backend</span></span>
<span class="line"><span style="color:#A6ACCD;">      # #每个虚拟路由器惟一标识，范围：0-255，同一组虚拟路由器的vrid必须一致</span></span>
<span class="line"><span style="color:#A6ACCD;">      - KEEPALIVED_VIRTUAL_ROUTER_ID=57</span></span>
<span class="line"><span style="color:#A6ACCD;">      - AUTH_PASSWORD=tK4A8XeFhNoacfQkoQAR</span></span>
<span class="line"><span style="color:#A6ACCD;">      - KEEPALIVED_PRIORITY=101</span></span>
<span class="line"><span style="color:#A6ACCD;">      - CHECK_IP=127.0.0.1</span></span>
<span class="line"><span style="color:#A6ACCD;">      - CHECK_PORT=80</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">      # 迁移环境后，以下参数必须要改</span></span>
<span class="line"><span style="color:#A6ACCD;">      - KEEPALIVED_INTERFACE=ens18</span></span>
<span class="line"><span style="color:#A6ACCD;">      - KEEPALIVED_VIRTUAL_IPS=192.168.252.15</span></span>
<span class="line"><span style="color:#A6ACCD;">      - KEEPALIVED_UNICAST_PEERS=192.168.252.12 192.168.252.14      </span></span>
<span class="line"><span style="color:#A6ACCD;">    volumes:</span></span>
<span class="line"><span style="color:#A6ACCD;">      - /lib/modules:/lib/modules</span></span>
<span class="line"><span style="color:#A6ACCD;">      - ./keepalived:/etc/keepalived</span></span>
<span class="line"><span style="color:#A6ACCD;">    command: [&quot;/bin/bash&quot;, &quot;-c&quot;, &quot;/etc/keepalived/generate.sh&quot;]</span></span>
<span class="line"><span style="color:#A6ACCD;">    restart: on-failure</span></span>
<span class="line"><span style="color:#A6ACCD;">    logging:</span></span>
<span class="line"><span style="color:#A6ACCD;">      options:</span></span>
<span class="line"><span style="color:#A6ACCD;">        max-size: &quot;10m&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">        max-file: &quot;5&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h3 id="check-port-sh-template" tabindex="-1">check_port.sh.template <a class="header-anchor" href="#check-port-sh-template" aria-label="Permalink to &quot;check_port.sh.template&quot;">​</a></h3><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">#!/bin/bash</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"># Check port</span></span>
<span class="line"><span style="color:#A6ACCD;">nc -z -w 1 {{ CHECK_IP }} {{ CHECK_PORT }}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h3 id="keepalived-conf-template" tabindex="-1">keepalived.conf.template <a class="header-anchor" href="#keepalived-conf-template" aria-label="Permalink to &quot;keepalived.conf.template&quot;">​</a></h3><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">global_defs {</span></span>
<span class="line"><span style="color:#A6ACCD;">    router_id {{ KEEPALIVED_CONFIG_NAME }}</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">vrrp_script check_port {</span></span>
<span class="line"><span style="color:#A6ACCD;">    script &quot;/etc/keepalived/check_port_{{ KEEPALIVED_CONFIG_NAME }}.sh&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">    interval 1</span></span>
<span class="line"><span style="color:#A6ACCD;">    fall 3</span></span>
<span class="line"><span style="color:#A6ACCD;">    rise 2</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">vrrp_instance VI_1 {</span></span>
<span class="line"><span style="color:#A6ACCD;">    interface {{ KEEPALIVED_INTERFACE }}</span></span>
<span class="line"><span style="color:#A6ACCD;">    state MASTER</span></span>
<span class="line"><span style="color:#A6ACCD;">    virtual_router_id {{ KEEPALIVED_VIRTUAL_ROUTER_ID }}</span></span>
<span class="line"><span style="color:#A6ACCD;">    priority {{ KEEPALIVED_PRIORITY }}</span></span>
<span class="line"><span style="color:#A6ACCD;">    advert_int 1</span></span>
<span class="line"><span style="color:#A6ACCD;">    authentication {</span></span>
<span class="line"><span style="color:#A6ACCD;">        auth_type PASS</span></span>
<span class="line"><span style="color:#A6ACCD;">        auth_pass {{ AUTH_PASSWORD }}</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">    virtual_ipaddress {</span></span>
<span class="line"><span style="color:#A6ACCD;">        {{ KEEPALIVED_VIRTUAL_IPS }}</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">    track_script {</span></span>
<span class="line"><span style="color:#A6ACCD;">        check_port</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h3 id="generate-sh" tabindex="-1">generate.sh <a class="header-anchor" href="#generate-sh" aria-label="Permalink to &quot;generate.sh&quot;">​</a></h3><blockquote><p>这里有个问题，就是 generate.sh 需要先手动赋予可执行权限，不然多个Keepalived同时启用，有点问题</p></blockquote><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">#!/bin/bash</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"># 检查模板文件是否存在</span></span>
<span class="line"><span style="color:#A6ACCD;">if [ ! -f /etc/keepalived/keepalived.conf.template ] || [ ! -f /etc/keepalived/check_port.sh.template ]; then</span></span>
<span class="line"><span style="color:#A6ACCD;">  echo &quot;Template file /etc/keepalived/keepalived.conf.template or /etc/keepalived/check_port.sh.template not found.&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">  exit 1</span></span>
<span class="line"><span style="color:#A6ACCD;">fi</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"># 填充模板文件</span></span>
<span class="line"><span style="color:#A6ACCD;">sed -e &quot;s|{{ KEEPALIVED_INTERFACE }}|$KEEPALIVED_INTERFACE|g&quot; \\</span></span>
<span class="line"><span style="color:#A6ACCD;">    -e &quot;s|{{ KEEPALIVED_VIRTUAL_ROUTER_ID }}|$KEEPALIVED_VIRTUAL_ROUTER_ID|g&quot; \\</span></span>
<span class="line"><span style="color:#A6ACCD;">    -e &quot;s|{{ KEEPALIVED_PRIORITY }}|$KEEPALIVED_PRIORITY|g&quot; \\</span></span>
<span class="line"><span style="color:#A6ACCD;">    -e &quot;s|{{ AUTH_PASSWORD }}|$AUTH_PASSWORD|g&quot; \\</span></span>
<span class="line"><span style="color:#A6ACCD;">    -e &quot;s|{{ KEEPALIVED_VIRTUAL_IPS }}|$KEEPALIVED_VIRTUAL_IPS|g&quot; \\</span></span>
<span class="line"><span style="color:#A6ACCD;">    -e &quot;s|{{ KEEPALIVED_CONFIG_NAME }}|$KEEPALIVED_CONFIG_NAME|g&quot; \\</span></span>
<span class="line"><span style="color:#A6ACCD;">    /etc/keepalived/keepalived.conf.template &gt; /etc/keepalived/keepalived_$KEEPALIVED_CONFIG_NAME.conf</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">sed -e &quot;s|{{ CHECK_PORT }}|$CHECK_PORT|g&quot; \\</span></span>
<span class="line"><span style="color:#A6ACCD;">    -e &quot;s|{{ CHECK_IP }}|$CHECK_IP|g&quot; \\</span></span>
<span class="line"><span style="color:#A6ACCD;">    /etc/keepalived/check_port.sh.template &gt; /etc/keepalived/check_port_$KEEPALIVED_CONFIG_NAME.sh</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">chmod +x /etc/keepalived/check_port_$KEEPALIVED_CONFIG_NAME.sh</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"># tail -f /dev/null</span></span>
<span class="line"><span style="color:#A6ACCD;"># 启动 Keepalived</span></span>
<span class="line"><span style="color:#A6ACCD;">exec keepalived -n -f /etc/keepalived/keepalived_\${KEEPALIVED_CONFIG_NAME}.conf</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div>`,14),o=[p];function c(t,A,i,C,r,D){return a(),n("div",null,o)}const _=s(l,[["render",c]]);export{d as __pageData,_ as default};
