import{_ as a,o as s,c as n,N as e}from"./chunks/framework.727b779d.js";const m=JSON.parse('{"title":"Nginx Proxy 可视化管理界面","description":"","frontmatter":{},"headers":[],"relativePath":"other/nginx-manager.md"}'),p={name:"other/nginx-manager.md"},l=e(`<h1 id="nginx-proxy-可视化管理界面" tabindex="-1">Nginx Proxy 可视化管理界面 <a class="header-anchor" href="#nginx-proxy-可视化管理界面" aria-label="Permalink to &quot;Nginx Proxy 可视化管理界面&quot;">​</a></h1><p>提到Nginx很多运维人员又是喜欢又是愁。喜欢是因为功能强大，性能强，愁的是配置管理确实复杂了点。很多新手第一次接触Nginx都会被其各种复杂的配置项搞得头疼，什么 location、什么 upstream，傻傻分不清楚。比如一个简单的单层反向代理 /api 配置：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#babed8;"></span></span>
<span class="line"><span style="color:#babed8;">http {</span></span>
<span class="line"><span style="color:#babed8;">    server {</span></span>
<span class="line"><span style="color:#babed8;">        listen 80;</span></span>
<span class="line"><span style="color:#babed8;"></span></span>
<span class="line"><span style="color:#babed8;">        location /api {</span></span>
<span class="line"><span style="color:#babed8;">            proxy_pass http://backend_server:8080;</span></span>
<span class="line"><span style="color:#babed8;">            proxy_set_header Host $host;</span></span>
<span class="line"><span style="color:#babed8;">            proxy_set_header X-Real-IP $remote_addr;</span></span>
<span class="line"><span style="color:#babed8;">            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;</span></span>
<span class="line"><span style="color:#babed8;">            proxy_set_header X-Forwarded-Proto $scheme;</span></span>
<span class="line"><span style="color:#babed8;">        }</span></span>
<span class="line"><span style="color:#babed8;"></span></span>
<span class="line"><span style="color:#babed8;">        location / {</span></span>
<span class="line"><span style="color:#babed8;">            # 这里可以配置静态文件服务或其他路径的处理</span></span>
<span class="line"><span style="color:#babed8;">        }</span></span>
<span class="line"><span style="color:#babed8;">    }</span></span>
<span class="line"><span style="color:#babed8;">}</span></span>
<span class="line"><span style="color:#babed8;"></span></span></code></pre></div><p>上述代码只是单层反向代理，如果涉及多台反向代理，配置更为复杂，如下：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#babed8;"># 第一层反向代理配置</span></span>
<span class="line"><span style="color:#babed8;">server {</span></span>
<span class="line"><span style="color:#babed8;">    listen 80;</span></span>
<span class="line"><span style="color:#babed8;">    server_name proxy1.example.com;</span></span>
<span class="line"><span style="color:#babed8;"></span></span>
<span class="line"><span style="color:#babed8;">    location / {</span></span>
<span class="line"><span style="color:#babed8;">        proxy_pass http://proxy2.example.com; # 转发到第二层代理</span></span>
<span class="line"><span style="color:#babed8;">        proxy_set_header Host $host;</span></span>
<span class="line"><span style="color:#babed8;">        proxy_set_header X-Real-IP $remote_addr;</span></span>
<span class="line"><span style="color:#babed8;">        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;</span></span>
<span class="line"><span style="color:#babed8;">        # 其他可能需要的proxy_set_header配置</span></span>
<span class="line"><span style="color:#babed8;">    }</span></span>
<span class="line"><span style="color:#babed8;">}</span></span>
<span class="line"><span style="color:#babed8;"></span></span>
<span class="line"><span style="color:#babed8;"># 第二层反向代理配置</span></span>
<span class="line"><span style="color:#babed8;">server {</span></span>
<span class="line"><span style="color:#babed8;">    listen 80;</span></span>
<span class="line"><span style="color:#babed8;">    server_name proxy2.example.com;</span></span>
<span class="line"><span style="color:#babed8;"></span></span>
<span class="line"><span style="color:#babed8;">    location / {</span></span>
<span class="line"><span style="color:#babed8;">        proxy_pass http://final-destination.example.com; # 最终服务器</span></span>
<span class="line"><span style="color:#babed8;">        proxy_set_header Host $host;</span></span>
<span class="line"><span style="color:#babed8;">        proxy_set_header X-Real-IP $remote_addr;</span></span>
<span class="line"><span style="color:#babed8;">        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;</span></span>
<span class="line"><span style="color:#babed8;">        # 其他可能需要的proxy_set_header配置</span></span>
<span class="line"><span style="color:#babed8;">    }</span></span>
<span class="line"><span style="color:#babed8;">}</span></span>
<span class="line"><span style="color:#babed8;"></span></span>
<span class="line"><span style="color:#babed8;"># 最终服务器配置</span></span>
<span class="line"><span style="color:#babed8;">server {</span></span>
<span class="line"><span style="color:#babed8;">    listen 80;</span></span>
<span class="line"><span style="color:#babed8;">    server_name final-destination.example.com;</span></span>
<span class="line"><span style="color:#babed8;"></span></span>
<span class="line"><span style="color:#babed8;">    location / {</span></span>
<span class="line"><span style="color:#babed8;">        # 最终处理请求的配置</span></span>
<span class="line"><span style="color:#babed8;">    }</span></span>
<span class="line"><span style="color:#babed8;">}</span></span>
<span class="line"><span style="color:#babed8;"></span></span></code></pre></div><p>在上面的多层反向代理配置中，请求到第一层代理proxy1.example.com，然后由proxy1转发请求到第二层代理proxy2.example.com，最后由proxy2转发请求到最终服务器final-destination.example.com。每层代理都必须正确地设置X-Real-IP和X-Forwarded-For，如果出现任何的配置错误，那么就会导致Nginx运行失败。</p><p>那么有没有什么办法快速学习会Nginx，同时降低Nginx配置的复杂度呢，答案是有的。第一种：脑袋聪明图片，一学就会的Nginx大神图片，那么什么复杂问题都不是问题了。很显然，小编不是这种脑袋聪明的，但是小编会“偷懒”。所以，选择了第二种，Nginx可视化管理界面：nginx-proxy-manager</p><h3 id="nginx-proxy-manager-介绍" tabindex="-1">nginx-proxy-manager 介绍 <a class="header-anchor" href="#nginx-proxy-manager-介绍" aria-label="Permalink to &quot;nginx-proxy-manager 介绍&quot;">​</a></h3><p>一句话介绍nginx-proxy-manager：为用户提供简单而强大的Nginx Proxy可视化管理界面，降低学习和配置门槛</p><h3 id="项目信息" tabindex="-1">项目信息 <a class="header-anchor" href="#项目信息" aria-label="Permalink to &quot;项目信息&quot;">​</a></h3><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#babed8;"># Github地址</span></span>
<span class="line"><span style="color:#babed8;">https://github.com/NginxProxyManager/nginx-proxy-manager</span></span>
<span class="line"><span style="color:#babed8;"># 项目网站地址</span></span>
<span class="line"><span style="color:#babed8;">https://nginxproxymanager.com/</span></span>
<span class="line"><span style="color:#babed8;"></span></span></code></pre></div><h3 id="功能特性" tabindex="-1">功能特性 <a class="header-anchor" href="#功能特性" aria-label="Permalink to &quot;功能特性&quot;">​</a></h3><blockquote><p>基于 Tabler 的美观、安全的可视化管理界面</p></blockquote><blockquote><p>无需了解 Nginx 即可轻松创建管理代理、重定向、streams 和 404</p></blockquote><blockquote><p>基于 Let&#39;s Encrypt 支持免费 SSL 证书和支持用户自定义 SSL 证书</p></blockquote><blockquote><p>主机的访问列表管理和基本 HTTP 身份验证</p></blockquote><blockquote><p>为管理员提供更高级 Nginx 配置</p></blockquote><blockquote><p>用户管理、权限和审计操作日志</p></blockquote><h3 id="nginx-proxy-manager-安装" tabindex="-1">nginx-proxy-manager 安装 <a class="header-anchor" href="#nginx-proxy-manager-安装" aria-label="Permalink to &quot;nginx-proxy-manager 安装&quot;">​</a></h3><blockquote><p>具备docker和docker-compose环境</p></blockquote><ul><li>创建docker-compose.yml文件</li></ul><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#babed8;">version: &#39;3.8&#39;</span></span>
<span class="line"><span style="color:#babed8;">services:</span></span>
<span class="line"><span style="color:#babed8;">  app:</span></span>
<span class="line"><span style="color:#babed8;">    image: &#39;docker.io/jc21/nginx-proxy-manager:latest&#39;</span></span>
<span class="line"><span style="color:#babed8;">    restart: unless-stopped</span></span>
<span class="line"><span style="color:#babed8;">    ports:</span></span>
<span class="line"><span style="color:#babed8;">      - &#39;80:80&#39;</span></span>
<span class="line"><span style="color:#babed8;">      - &#39;81:81&#39;</span></span>
<span class="line"><span style="color:#babed8;">      - &#39;443:443&#39;</span></span>
<span class="line"><span style="color:#babed8;">    volumes:</span></span>
<span class="line"><span style="color:#babed8;">      - ./data:/data</span></span>
<span class="line"><span style="color:#babed8;">      - ./letsencrypt:/etc/letsencrypt</span></span>
<span class="line"><span style="color:#babed8;"></span></span>
<span class="line"><span style="color:#babed8;"></span></span></code></pre></div><ul><li>启动服务</li></ul><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#babed8;">docker-compose up -d</span></span>
<span class="line"><span style="color:#babed8;"></span></span></code></pre></div><p>部署完成后，通过浏览器访问：<a href="http://hostip:81" target="_blank" rel="noreferrer">http://hostip:81</a> 打开nginx-proxy-manager界面，账号密码</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#babed8;">Email:    admin@example.com</span></span>
<span class="line"><span style="color:#babed8;">Password: changeme</span></span>
<span class="line"><span style="color:#babed8;"></span></span></code></pre></div><h3 id="nginx-proxy-manager-使用" tabindex="-1">nginx-proxy-manager 使用 <a class="header-anchor" href="#nginx-proxy-manager-使用" aria-label="Permalink to &quot;nginx-proxy-manager 使用&quot;">​</a></h3><p>一. 创建proxy host</p><p><img src="https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202404180907322.png" alt=""></p><ul><li><p>域名：域名就是反向代理使用的域名</p></li><li><p>协议：依据后续服务协议，选择http或者https</p></li><li><p>转发主机/IP：后端服务地址</p></li><li><p>转发端口：后端服务端口。</p></li><li><p>缓存资源、阻断常见漏洞、支持 WebSockets 三个依据服务需求自行选择</p></li><li><p>自定义location</p></li></ul><p><img src="https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202404180908467.png" alt=""></p><p>配置SSL</p><p><img src="https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202404180908616.png" alt=""></p><p>高级配置</p><p><img src="https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202404180908593.png" alt=""></p><p>配置完成后，在【Hosts】界面显示主机清单</p><p><img src="https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202404191013385.png" alt=""></p><p>二、创建重定向</p><p><img src="https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202404180918657.png" alt=""></p><ul><li>配置重定向SSL</li></ul><p><img src="https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202404180921601.png" alt=""></p><ul><li>自定义高级配置</li></ul><p><img src="https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202404180921149.png" alt=""></p><p>三、配置Stream</p><p><img src="https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202404181057705.png" alt=""></p><p>四、配置404</p><p><img src="https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202404181103985.png" alt=""></p><p>五、配置访问控制</p><p><img src="https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202404181108923.png" alt=""></p>`,49),o=[l];function r(t,c,i,d,b,y){return s(),n("div",null,o)}const h=a(p,[["render",r]]);export{m as __pageData,h as default};
