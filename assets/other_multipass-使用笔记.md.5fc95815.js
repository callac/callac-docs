import{_ as s,c as n,o as a,N as l}from"./chunks/framework.a5f3ff40.js";const m=JSON.parse('{"title":"multipass","description":"","frontmatter":{},"headers":[],"relativePath":"other/multipass-使用笔记.md"}'),p={name:"other/multipass-使用笔记.md"},e=l(`<h1 id="multipass" tabindex="-1">multipass <a class="header-anchor" href="#multipass" aria-label="Permalink to &quot;multipass&quot;">​</a></h1><h2 id="概述" tabindex="-1">概述 <a class="header-anchor" href="#概述" aria-label="Permalink to &quot;概述&quot;">​</a></h2><blockquote><p>Multipass 是一款适用于 Linux、Windows 和 macOS 的轻量级 VM 管理器。它专为想要通过单个命令获得全新 Ubuntu 环境的开发人员而设计。它在 Linux 上使用 KVM、Windows 上的 Hyper-V 和 macOS 上的 QEMU 以最小的开销运行虚拟机。它还可以在 Windows 和 macOS 上使用 VirtualBox。</p></blockquote><blockquote><p>Multipass 提供了一个命令行界面来启动和管理 Linux 实例。下载一个全新的镜像需要几秒钟的时间，并且在几分钟内就可以启动并运行 VM。</p></blockquote><p>GitHub:<a href="https://github.com/canonical/multipass" target="_blank" rel="noreferrer">https://github.com/canonical/multipass</a></p><p>Multipass官网：<a href="https://multipass.run" target="_blank" rel="noreferrer">https://multipass.run</a></p><p>Multipass社区：<a href="https://discourse.ubuntu.com/c/multipass/21/all" target="_blank" rel="noreferrer">https://discourse.ubuntu.com/c/multipass/21/all</a></p><p>Multipass文档：<a href="https://multipass.run/docs" target="_blank" rel="noreferrer">https://multipass.run/docs</a></p><h2 id="安装multipass" tabindex="-1">安装Multipass <a class="header-anchor" href="#安装multipass" aria-label="Permalink to &quot;安装Multipass&quot;">​</a></h2><blockquote><p>在官方网站：<a href="https://multipass.run/install" target="_blank" rel="noreferrer">https://multipass.run/install</a></p></blockquote><h2 id="multipass命令" tabindex="-1">multipass命令 <a class="header-anchor" href="#multipass命令" aria-label="Permalink to &quot;multipass命令&quot;">​</a></h2><blockquote><p>执行multipass命令，自动打印multipass相关的操作命令、以及简单的功能描述信息，具体如下：</p></blockquote><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">root@ubuntu:~# multipass</span></span>
<span class="line"><span style="color:#A6ACCD;">Usage: multipass [options] &lt;command&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">Create, control and connect to Ubuntu instances.</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">This is a command line utility for multipass, a</span></span>
<span class="line"><span style="color:#A6ACCD;">service that manages Ubuntu instances.</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">Options:</span></span>
<span class="line"><span style="color:#A6ACCD;">  -h, --help     Displays help on commandline options</span></span>
<span class="line"><span style="color:#A6ACCD;">  -v, --verbose  Increase logging verbosity. Repeat the &#39;v&#39; in the short option</span></span>
<span class="line"><span style="color:#A6ACCD;">                 for more detail. Maximum verbosity is obtained with 4 (or more)</span></span>
<span class="line"><span style="color:#A6ACCD;">                 v&#39;s, i.e. -vvvv.</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">Available commands:</span></span>
<span class="line"><span style="color:#A6ACCD;">  alias         创建别名</span></span>
<span class="line"><span style="color:#A6ACCD;">  aliases       列出所有可用的别名</span></span>
<span class="line"><span style="color:#A6ACCD;">  authenticate  认证客户端</span></span>
<span class="line"><span style="color:#A6ACCD;">  delete        删除实例和快照</span></span>
<span class="line"><span style="color:#A6ACCD;">  exec          在实例上运行命令</span></span>
<span class="line"><span style="color:#A6ACCD;">  find          显示可用于创建实例的映像</span></span>
<span class="line"><span style="color:#A6ACCD;">  get           获取配置设置</span></span>
<span class="line"><span style="color:#A6ACCD;">  help          显示某个命令的帮助</span></span>
<span class="line"><span style="color:#A6ACCD;">  info          显示关于实例或快照的信息</span></span>
<span class="line"><span style="color:#A6ACCD;">  launch        创建并启动一个 Ubuntu 实例</span></span>
<span class="line"><span style="color:#A6ACCD;">  list          列出所有可用的实例或快照</span></span>
<span class="line"><span style="color:#A6ACCD;">  mount         在实例中挂载一个本地目录</span></span>
<span class="line"><span style="color:#A6ACCD;">  networks      列出可用的网络接口</span></span>
<span class="line"><span style="color:#A6ACCD;">  prefer        切换当前的别名上下文</span></span>
<span class="line"><span style="color:#A6ACCD;">  purge         永久删除所有已删除的实例</span></span>
<span class="line"><span style="color:#A6ACCD;">  recover       恢复已删除的实例</span></span>
<span class="line"><span style="color:#A6ACCD;">  restart       重启实例</span></span>
<span class="line"><span style="color:#A6ACCD;">  restore       从快照中恢复一个实例</span></span>
<span class="line"><span style="color:#A6ACCD;">  set           设置配置参数</span></span>
<span class="line"><span style="color:#A6ACCD;">  shell         在正在运行的实例上打开一个 shell</span></span>
<span class="line"><span style="color:#A6ACCD;">  snapshot      为一个实例创建快照</span></span>
<span class="line"><span style="color:#A6ACCD;">  start         启动实例</span></span>
<span class="line"><span style="color:#A6ACCD;">  stop          停止正在运行的实例</span></span>
<span class="line"><span style="color:#A6ACCD;">  suspend       挂起正在运行的实例</span></span>
<span class="line"><span style="color:#A6ACCD;">  transfer      在主机和实例之间传输文件</span></span>
<span class="line"><span style="color:#A6ACCD;">  umount        从实例中卸载目录</span></span>
<span class="line"><span style="color:#A6ACCD;">  unalias       删除别名</span></span>
<span class="line"><span style="color:#A6ACCD;">  version       显示版本详细信息</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h2 id="命令使用说明" tabindex="-1">命令使用说明 <a class="header-anchor" href="#命令使用说明" aria-label="Permalink to &quot;命令使用说明&quot;">​</a></h2><blockquote><p>对于Multipass的命令怎么使用，这里以创建一个虚拟机为例说明。</p></blockquote><p>可以在上面命令中发现，要创建虚拟机，应该使用launch命令，如果不知道后面参数如何填写，可以执行类似于multipass help launch这样的命令来帮助如何更具体的使用。</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">root@ubuntu:~# multipass help launch</span></span>
<span class="line"><span style="color:#A6ACCD;">Usage: multipass launch [options] [[&lt;remote:&gt;]&lt;image&gt; | &lt;url&gt;]</span></span>
<span class="line"><span style="color:#A6ACCD;">Create and start a new instance.</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">Options:</span></span>
<span class="line"><span style="color:#A6ACCD;">  -h, --help                        显示命令行选项的帮助</span></span>
<span class="line"><span style="color:#A6ACCD;">  -v, --verbose                         增加日志详细程度。重复 &#39;v&#39; 可获得更多细节。</span></span>
<span class="line"><span style="color:#A6ACCD;">                                        最大详细程度需要 4 个 (或更多) 个 v,即 -vvvv。</span></span>
<span class="line"><span style="color:#A6ACCD;">  -c, --cpus &lt;cpus&gt;                     分配的 CPU 数量。</span></span>
<span class="line"><span style="color:#A6ACCD;">                                        最小值: 1, 默认值: 1。</span></span>
<span class="line"><span style="color:#A6ACCD;">  -d, --disk &lt;磁盘&gt;                     分配的磁盘空间。正整数,单位为字节,或带有</span></span>
<span class="line"><span style="color:#A6ACCD;">                                        K、M、G 后缀的小数。</span></span>
<span class="line"><span style="color:#A6ACCD;">                                        最小值: 512M, 默认值: 5G。</span></span>
<span class="line"><span style="color:#A6ACCD;">  -m, --memory &lt;内存&gt;                   分配的内存量。正整数,单位为字节,或带有</span></span>
<span class="line"><span style="color:#A6ACCD;">                                        K、M、G 后缀的小数。</span></span>
<span class="line"><span style="color:#A6ACCD;">                                        最小值: 128M, 默认值: 1G。</span></span>
<span class="line"><span style="color:#A6ACCD;">  -n, --name &lt;名称&gt;                     实例的名称。如果它是 &#39;primary&#39;</span></span>
<span class="line"><span style="color:#A6ACCD;">                                        (配置的主实例名称), 用户的主目录将在新启动的</span></span>
<span class="line"><span style="color:#A6ACCD;">                                        实例中挂载在 &#39;Home&#39; 目录下。</span></span>
<span class="line"><span style="color:#A6ACCD;">                                        有效的名称必须由字母、数字或连字符组成,</span></span>
<span class="line"><span style="color:#A6ACCD;">                                        必须以字母开头,并以字母数字字符结尾。</span></span>
<span class="line"><span style="color:#A6ACCD;">  --cloud-init &lt;文件&gt; | &lt;URL&gt;           用户数据 cloud-init 配置的路径或 URL,</span></span>
<span class="line"><span style="color:#A6ACCD;">                                        或 &#39;-&#39; 表示从标准输入读取。</span></span>
<span class="line"><span style="color:#A6ACCD;">  --network &lt;规格&gt;                      为实例添加网络接口,其中 &lt;规格&gt; 采用</span></span>
<span class="line"><span style="color:#A6ACCD;">                                        &quot;key=value,key=value&quot; 格式,可用的键有:</span></span>
<span class="line"><span style="color:#A6ACCD;">                                         name: 要连接的网络(必需),使用 networks</span></span>
<span class="line"><span style="color:#A6ACCD;">                                        命令查看可用值,或使用 &#39;bridged&#39; 来使用通过</span></span>
<span class="line"><span style="color:#A6ACCD;">                                        \`multipass set local.bridged-network\` 配置的接口。</span></span>
<span class="line"><span style="color:#A6ACCD;">                                         mode: auto|manual (默认: auto)</span></span>
<span class="line"><span style="color:#A6ACCD;">                                         mac: 硬件地址 (默认: 随机)。</span></span>
<span class="line"><span style="color:#A6ACCD;">                                        您也可以使用 &quot;&lt;name&gt;&quot; 作为快捷方式,</span></span>
<span class="line"><span style="color:#A6ACCD;">                                        意为 &quot;name=&lt;name&gt;&quot;。</span></span>
<span class="line"><span style="color:#A6ACCD;">  --bridged                             添加一个 \`--network bridged\` 网络。</span></span>
<span class="line"><span style="color:#A6ACCD;">  --mount &lt;本地路径&gt;:&lt;实例路径&gt;         在实例中挂载一个本地目录。如果 &lt;实例路径&gt; 被省略,</span></span>
<span class="line"><span style="color:#A6ACCD;">                                        挂载点将与 &lt;本地路径&gt; 的绝对路径相同。</span></span>
<span class="line"><span style="color:#A6ACCD;">  --timeout &lt;超时&gt;                      命令完成的最长等待时间,以秒为单位。请注意,</span></span>
<span class="line"><span style="color:#A6ACCD;">                                        某些后台操作可能会在此时间之后继续。默认情况下,</span></span>
<span class="line"><span style="color:#A6ACCD;">                                        实例启动和初始化分别限制为 5 分钟。</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">参数:</span></span>
<span class="line"><span style="color:#A6ACCD;">  image                                 要启动的可选镜像。如果省略,则使用默认的</span></span>
<span class="line"><span style="color:#A6ACCD;">                                        Ubuntu LTS。</span></span>
<span class="line"><span style="color:#A6ACCD;">                                        &lt;remote&gt; 可以是 &#39;release&#39; 或 &#39;daily&#39;。</span></span>
<span class="line"><span style="color:#A6ACCD;">                                        如果省略 &lt;远程&gt;, 将使用 &#39;release&#39;。</span></span>
<span class="line"><span style="color:#A6ACCD;">                                        &lt;image&gt; 可以是部分镜像散列或 Ubuntu 发行版本、</span></span>
<span class="line"><span style="color:#A6ACCD;">                                        代号或别名。</span></span>
<span class="line"><span style="color:#A6ACCD;">                                        &lt;url&gt; 是自定义镜像 URL,格式为 http://、</span></span>
<span class="line"><span style="color:#A6ACCD;">                                        https:// 或 file://。</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h2 id="multipass的使用" tabindex="-1">Multipass的使用 <a class="header-anchor" href="#multipass的使用" aria-label="Permalink to &quot;Multipass的使用&quot;">​</a></h2><p>查看镜像列表 执行以下命令，查看受支持的系统镜像列表</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">multipass find</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">root@ubuntu:~# multipass find</span></span>
<span class="line"><span style="color:#A6ACCD;">Image                       Aliases           Version          Description</span></span>
<span class="line"><span style="color:#A6ACCD;">core                        core16            20200818         Ubuntu Core 16</span></span>
<span class="line"><span style="color:#A6ACCD;">core18                                        20211124         Ubuntu Core 18</span></span>
<span class="line"><span style="color:#A6ACCD;">core20                                        20230119         Ubuntu Core 20</span></span>
<span class="line"><span style="color:#A6ACCD;">core22                                        20230717         Ubuntu Core 22</span></span>
<span class="line"><span style="color:#A6ACCD;">20.04                       focal             20240626         Ubuntu 20.04 LTS</span></span>
<span class="line"><span style="color:#A6ACCD;">22.04                       jammy             20240701         Ubuntu 22.04 LTS</span></span>
<span class="line"><span style="color:#A6ACCD;">23.10                       mantic            20240701         Ubuntu 23.10</span></span>
<span class="line"><span style="color:#A6ACCD;">24.04                       noble,lts         20240702         Ubuntu 24.04 LTS</span></span>
<span class="line"><span style="color:#A6ACCD;">daily:24.10                 oracular,devel    20240626         Ubuntu 24.10</span></span>
<span class="line"><span style="color:#A6ACCD;">appliance:adguard-home                        20200812         Ubuntu AdGuard Home Appliance</span></span>
<span class="line"><span style="color:#A6ACCD;">appliance:mosquitto                           20200812         Ubuntu Mosquitto Appliance</span></span>
<span class="line"><span style="color:#A6ACCD;">appliance:nextcloud                           20200812         Ubuntu Nextcloud Appliance</span></span>
<span class="line"><span style="color:#A6ACCD;">appliance:openhab                             20200812         Ubuntu openHAB Home Appliance</span></span>
<span class="line"><span style="color:#A6ACCD;">appliance:plexmediaserver                     20200812         Ubuntu Plex Media Server Appliance</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">Blueprint                   Aliases           Version          Description</span></span>
<span class="line"><span style="color:#A6ACCD;">anbox-cloud-appliance                         latest           Anbox Cloud Appliance</span></span>
<span class="line"><span style="color:#A6ACCD;">charm-dev                                     latest           A development and testing environment for charmers</span></span>
<span class="line"><span style="color:#A6ACCD;">docker                                        0.4              A Docker environment with Portainer and related tools</span></span>
<span class="line"><span style="color:#A6ACCD;">jellyfin                                      latest           Jellyfin is a Free Software Media System that puts you in control of managing and streaming your media.</span></span>
<span class="line"><span style="color:#A6ACCD;">minikube                                      latest           minikube is local Kubernetes</span></span>
<span class="line"><span style="color:#A6ACCD;">ros-noetic                                    0.1              A development and testing environment for ROS Noetic.</span></span>
<span class="line"><span style="color:#A6ACCD;">ros2-humble                                   0.1              A development and testing environment for ROS 2 Humble.</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>新建和运行虚拟机 创建和运行基本虚拟机的命令语法如下：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">multipass launch --name &lt;虚拟机实例名称&gt; &lt;系统镜像名称、别名(可选)&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>创建一个名为Ubuntu的虚拟机实例，默认使用最新版ubuntu 24.04镜像，此种方式不推荐</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">multipass launch --name node02 jammy</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>更高级的或更实用的创建方式如下：</p><blockquote><p>创建4核心、4GB内存、100G虚拟磁盘的Ubuntu实例</p></blockquote><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">multipass launch --name master -c 4 -m 4G -d 100G</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">-n, --name: 虚拟机名称</span></span>
<span class="line"><span style="color:#A6ACCD;">-c, --cpus: cpu核心数, 默认: 1</span></span>
<span class="line"><span style="color:#A6ACCD;">-m, --mem: 内存大小, 默认: 1G</span></span>
<span class="line"><span style="color:#A6ACCD;">-d, --disk: 硬盘大小, 默认: 5G</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>查看虚拟机列表 虚拟机创建完成后，可以使用multipass list命令进行查看虚拟机列表</p><blockquote><p>可以看到虚拟机详细信息，名称，状态，地址，镜像名称等信息。</p></blockquote><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">multipass list</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>此时可以看到目前正在运行的虚拟机，并且对应的IP地址为10.220.xxx.xxx，注意：此IP地址局域网内不能被访问</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">root@ubuntu:~# multipass list</span></span>
<span class="line"><span style="color:#A6ACCD;">Name                    State             IPv4             Image</span></span>
<span class="line"><span style="color:#A6ACCD;">foo                     Running           10.220.232.121   Ubuntu 24.04 LTS</span></span>
<span class="line"><span style="color:#A6ACCD;">v1                      Running           10.220.232.227   Ubuntu 24.04 LTS</span></span>
<span class="line"><span style="color:#A6ACCD;">vm1                     Running           10.220.232.188   Ubuntu 22.04 LTS</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>查看虚拟机信息 通过multipass info 虚拟机名称命令，查看当前运行的虚拟机信息</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">root@ubuntu:~# multipass info foo</span></span>
<span class="line"><span style="color:#A6ACCD;">Name:           foo</span></span>
<span class="line"><span style="color:#A6ACCD;">State:          Running</span></span>
<span class="line"><span style="color:#A6ACCD;">Snapshots:      0</span></span>
<span class="line"><span style="color:#A6ACCD;">IPv4:           10.220.232.121</span></span>
<span class="line"><span style="color:#A6ACCD;">Release:        Ubuntu 24.04 LTS</span></span>
<span class="line"><span style="color:#A6ACCD;">Image hash:     182dc760bfca (Ubuntu 24.04 LTS)</span></span>
<span class="line"><span style="color:#A6ACCD;">CPU(s):         1</span></span>
<span class="line"><span style="color:#A6ACCD;">Load:           0.11 0.04 0.01</span></span>
<span class="line"><span style="color:#A6ACCD;">Disk usage:     1.7GiB out of 4.8GiB</span></span>
<span class="line"><span style="color:#A6ACCD;">Memory usage:   400.0MiB out of 956.1MiB</span></span>
<span class="line"><span style="color:#A6ACCD;">Mounts:         --</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>进入虚拟机 通过multipass exec 虚拟机名称 执行命令方式，在实例内执行给定的命令</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">multipass exec foo bash</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>删除和释放实例 使用以下命令，可以开启、停止、删除和释放实例</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;"># 启动vm实例</span></span>
<span class="line"><span style="color:#A6ACCD;">multipass start vm</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"># 停止vm实例</span></span>
<span class="line"><span style="color:#A6ACCD;">multipass stop vm</span></span>
<span class="line"><span style="color:#A6ACCD;"># 停止全部虚拟机</span></span>
<span class="line"><span style="color:#A6ACCD;">multipass stop --all</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"># 删除vm实例(删除后，还存在)</span></span>
<span class="line"><span style="color:#A6ACCD;">multipass delete vm</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"># 释放实例(彻底删除)</span></span>
<span class="line"><span style="color:#A6ACCD;">multipass purge</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>初始化配置</p><blockquote><p>Multipass提供了--cloud-init选项，在创建虚拟机时，利用一个配置文件，启动初始化配置</p></blockquote><p>创建config.yaml初始化配置文件</p><blockquote><p>使用首次启动时运行命令，在初始化容器的时候，自动配置与更新软件源。</p></blockquote><div class="language-yaml"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">#cloud-config </span></span>
<span class="line"><span style="color:#F07178;">runcmd</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">sudo sed -i &#39;s|http://archive.ubuntu.com/|http://mirrors.aliyun.com/|g&#39; /etc/apt/sources.list.d/ubuntu.sources</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">sudo apt update -y</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">sudo apt upgrade -y</span></span>
<span class="line"></span>
<span class="line"></span></code></pre></div><p>注意：</p><blockquote><p>必须以 #cloud-config 开头，这是cloud-init 识别它的方式</p></blockquote><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">multipass launch --name ubuntu --cloud-init config.yaml</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>这里使用了一个简单配置示例，更多配置，参考文档：<a href="https://cloudinit.readthedocs.io/en/latest/reference/examples.html#" target="_blank" rel="noreferrer">Cloud config examples</a></p><p>虚拟机的调整 查看multipass set命令的使用说明:</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">root@ubuntu:~# multipass help set</span></span>
<span class="line"><span style="color:#A6ACCD;">Usage: multipass set [options] &lt;key&gt;[=&lt;value&gt;]</span></span>
<span class="line"><span style="color:#A6ACCD;">Set, to the given value, the configuration setting corresponding to the given key.</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">Some common settings keys are:</span></span>
<span class="line"><span style="color:#A6ACCD;">  - client.gui.autostart</span></span>
<span class="line"><span style="color:#A6ACCD;">  - local.driver</span></span>
<span class="line"><span style="color:#A6ACCD;">  - local.privileged-mounts</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">Use \`multipass get --keys\` to obtain the full list of available settings at any given time.</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">Options:</span></span>
<span class="line"><span style="color:#A6ACCD;">  -h, --help  显示命令行选项的帮助</span></span>
<span class="line"><span style="color:#A6ACCD;">  -v, --verbose   增加日志详细程度。重复 &#39;v&#39; 可获得更多细节。</span></span>
<span class="line"><span style="color:#A6ACCD;">                  最大详细程度需要 4 个 (或更多) 个 v,即 -vvvv。</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">参数:</span></span>
<span class="line"><span style="color:#A6ACCD;">  keyval          一个键,或一个键值对。键指定要配置的设置路径。</span></span>
<span class="line"><span style="color:#A6ACCD;">                  值是其预期值。如果只给出键,则会提示输入值。</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>获得当前可用设置的完整列表，发现有几个主要参数可以对虚拟机进行调整</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">root@ubuntu:~# multipass get --keys</span></span>
<span class="line"><span style="color:#A6ACCD;">client.gui.autostart</span></span>
<span class="line"><span style="color:#A6ACCD;">client.gui.hotkey</span></span>
<span class="line"><span style="color:#A6ACCD;">client.primary-name</span></span>
<span class="line"><span style="color:#A6ACCD;">local.bridged-network</span></span>
<span class="line"><span style="color:#A6ACCD;">local.driver</span></span>
<span class="line"><span style="color:#A6ACCD;">local.foo.cpus</span></span>
<span class="line"><span style="color:#A6ACCD;">local.foo.disk</span></span>
<span class="line"><span style="color:#A6ACCD;">local.foo.memory</span></span>
<span class="line"><span style="color:#A6ACCD;">local.image.mirror</span></span>
<span class="line"><span style="color:#A6ACCD;">local.passphrase</span></span>
<span class="line"><span style="color:#A6ACCD;">local.privileged-mounts</span></span>
<span class="line"><span style="color:#A6ACCD;">local.ubuntu.cpus</span></span>
<span class="line"><span style="color:#A6ACCD;">local.ubuntu.disk</span></span>
<span class="line"><span style="color:#A6ACCD;">local.ubuntu.memory</span></span>
<span class="line"><span style="color:#A6ACCD;">local.v1.cpus</span></span>
<span class="line"><span style="color:#A6ACCD;">local.v1.disk</span></span>
<span class="line"><span style="color:#A6ACCD;">local.v1.memory</span></span>
<span class="line"><span style="color:#A6ACCD;">local.vm1.cpus</span></span>
<span class="line"><span style="color:#A6ACCD;">local.vm1.disk</span></span>
<span class="line"><span style="color:#A6ACCD;">local.vm1.memory</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>配置示例如下：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">multipass set local.[实例名称].cpus=8</span></span>
<span class="line"><span style="color:#A6ACCD;">multipass set local.[实例名称].disk=300G</span></span>
<span class="line"><span style="color:#A6ACCD;">multipass set local.[实例名称].memory=8G</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>设置桥接网络接口</p><blockquote><p>当创建一个虚拟机后，分配的IP地址并不是一个局域网地址，这会造成局域网其他电脑无法访问，因此设置网络为桥接模式，前提是有这个需求。</p></blockquote><p>直接将重命名以太网为network，防止乱码问题</p><p>使用multipass networks命令，列出multipass可将实例连接到的网络接口</p><p>设置Multipass使用桥接模式，使用network网口</p><p>创建桥接模式的虚拟机</p><p>挂载数据卷</p><blockquote><p>multipass提供和Docker一样的挂载数据卷的功能，能够与外部宿主机的目录文件保持同步</p></blockquote><p>挂载语法</p><blockquote><p>multipass mount 宿主机目录 实例名:虚拟机目录</p></blockquote><p>挂载</p><blockquote><p>multipass mount ./data master:/data</p></blockquote><p><a href="https://blog.csdn.net/qq_38628046/article/details/139032790" target="_blank" rel="noreferrer">https://blog.csdn.net/qq_38628046/article/details/139032790</a></p>`,68),o=[e];function t(c,i,r,C,A,u){return a(),n("div",null,o)}const D=s(p,[["render",t]]);export{m as __pageData,D as default};
