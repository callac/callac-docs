<!--       
# multipass

## 概述
> Multipass 是一款适用于 Linux、Windows 和 macOS 的轻量级 VM 管理器。它专为想要通过单个命令获得全新 Ubuntu 环境的开发人员而设计。它在 Linux 上使用 KVM、Windows 上的 Hyper-V 和 macOS 上的 QEMU 以最小的开销运行虚拟机。它还可以在 Windows 和 macOS 上使用 VirtualBox。

> Multipass 提供了一个命令行界面来启动和管理 Linux 实例。下载一个全新的镜像需要几秒钟的时间，并且在几分钟内就可以启动并运行 VM。


GitHub:https://github.com/canonical/multipass

Multipass官网：https://multipass.run

Multipass社区：https://discourse.ubuntu.com/c/multipass/21/all

Multipass文档：https://multipass.run/docs


## 安装Multipass

> 在官方网站：https://multipass.run/install 

## multipass命令

> 执行multipass命令，自动打印multipass相关的操作命令、以及简单的功能描述信息，具体如下：

```
root@ubuntu:~# multipass
Usage: multipass [options] <command>
Create, control and connect to Ubuntu instances.

This is a command line utility for multipass, a
service that manages Ubuntu instances.

Options:
  -h, --help     Displays help on commandline options
  -v, --verbose  Increase logging verbosity. Repeat the 'v' in the short option
                 for more detail. Maximum verbosity is obtained with 4 (or more)
                 v's, i.e. -vvvv.

Available commands:
  alias         创建别名
  aliases       列出所有可用的别名
  authenticate  认证客户端
  delete        删除实例和快照
  exec          在实例上运行命令
  find          显示可用于创建实例的映像
  get           获取配置设置
  help          显示某个命令的帮助
  info          显示关于实例或快照的信息
  launch        创建并启动一个 Ubuntu 实例
  list          列出所有可用的实例或快照
  mount         在实例中挂载一个本地目录
  networks      列出可用的网络接口
  prefer        切换当前的别名上下文
  purge         永久删除所有已删除的实例
  recover       恢复已删除的实例
  restart       重启实例
  restore       从快照中恢复一个实例
  set           设置配置参数
  shell         在正在运行的实例上打开一个 shell
  snapshot      为一个实例创建快照
  start         启动实例
  stop          停止正在运行的实例
  suspend       挂起正在运行的实例
  transfer      在主机和实例之间传输文件
  umount        从实例中卸载目录
  unalias       删除别名
  version       显示版本详细信息
```

## 命令使用说明

> 对于Multipass的命令怎么使用，这里以创建一个虚拟机为例说明。

可以在上面命令中发现，要创建虚拟机，应该使用launch命令，如果不知道后面参数如何填写，可以执行类似于multipass help launch这样的命令来帮助如何更具体的使用。

```
root@ubuntu:~# multipass help launch
Usage: multipass launch [options] [[<remote:>]<image> | <url>]
Create and start a new instance.

Options:
  -h, --help                        显示命令行选项的帮助
  -v, --verbose                         增加日志详细程度。重复 'v' 可获得更多细节。
                                        最大详细程度需要 4 个 (或更多) 个 v,即 -vvvv。
  -c, --cpus <cpus>                     分配的 CPU 数量。
                                        最小值: 1, 默认值: 1。
  -d, --disk <磁盘>                     分配的磁盘空间。正整数,单位为字节,或带有
                                        K、M、G 后缀的小数。
                                        最小值: 512M, 默认值: 5G。
  -m, --memory <内存>                   分配的内存量。正整数,单位为字节,或带有
                                        K、M、G 后缀的小数。
                                        最小值: 128M, 默认值: 1G。
  -n, --name <名称>                     实例的名称。如果它是 'primary'
                                        (配置的主实例名称), 用户的主目录将在新启动的
                                        实例中挂载在 'Home' 目录下。
                                        有效的名称必须由字母、数字或连字符组成,
                                        必须以字母开头,并以字母数字字符结尾。
  --cloud-init <文件> | <URL>           用户数据 cloud-init 配置的路径或 URL,
                                        或 '-' 表示从标准输入读取。
  --network <规格>                      为实例添加网络接口,其中 <规格> 采用
                                        "key=value,key=value" 格式,可用的键有:
                                         name: 要连接的网络(必需),使用 networks
                                        命令查看可用值,或使用 'bridged' 来使用通过
                                        `multipass set local.bridged-network` 配置的接口。
                                         mode: auto|manual (默认: auto)
                                         mac: 硬件地址 (默认: 随机)。
                                        您也可以使用 "<name>" 作为快捷方式,
                                        意为 "name=<name>"。
  --bridged                             添加一个 `--network bridged` 网络。
  --mount <本地路径>:<实例路径>         在实例中挂载一个本地目录。如果 <实例路径> 被省略,
                                        挂载点将与 <本地路径> 的绝对路径相同。
  --timeout <超时>                      命令完成的最长等待时间,以秒为单位。请注意,
                                        某些后台操作可能会在此时间之后继续。默认情况下,
                                        实例启动和初始化分别限制为 5 分钟。

参数:
  image                                 要启动的可选镜像。如果省略,则使用默认的
                                        Ubuntu LTS。
                                        <remote> 可以是 'release' 或 'daily'。
                                        如果省略 <远程>, 将使用 'release'。
                                        <image> 可以是部分镜像散列或 Ubuntu 发行版本、
                                        代号或别名。
                                        <url> 是自定义镜像 URL,格式为 http://、
                                        https:// 或 file://。
```

## Multipass的使用

查看镜像列表
执行以下命令，查看受支持的系统镜像列表

```
multipass find
```

```
root@ubuntu:~# multipass find
Image                       Aliases           Version          Description
core                        core16            20200818         Ubuntu Core 16
core18                                        20211124         Ubuntu Core 18
core20                                        20230119         Ubuntu Core 20
core22                                        20230717         Ubuntu Core 22
20.04                       focal             20240626         Ubuntu 20.04 LTS
22.04                       jammy             20240701         Ubuntu 22.04 LTS
23.10                       mantic            20240701         Ubuntu 23.10
24.04                       noble,lts         20240702         Ubuntu 24.04 LTS
daily:24.10                 oracular,devel    20240626         Ubuntu 24.10
appliance:adguard-home                        20200812         Ubuntu AdGuard Home Appliance
appliance:mosquitto                           20200812         Ubuntu Mosquitto Appliance
appliance:nextcloud                           20200812         Ubuntu Nextcloud Appliance
appliance:openhab                             20200812         Ubuntu openHAB Home Appliance
appliance:plexmediaserver                     20200812         Ubuntu Plex Media Server Appliance

Blueprint                   Aliases           Version          Description
anbox-cloud-appliance                         latest           Anbox Cloud Appliance
charm-dev                                     latest           A development and testing environment for charmers
docker                                        0.4              A Docker environment with Portainer and related tools
jellyfin                                      latest           Jellyfin is a Free Software Media System that puts you in control of managing and streaming your media.
minikube                                      latest           minikube is local Kubernetes
ros-noetic                                    0.1              A development and testing environment for ROS Noetic.
ros2-humble                                   0.1              A development and testing environment for ROS 2 Humble.
```

新建和运行虚拟机
创建和运行基本虚拟机的命令语法如下：
```
multipass launch --name <虚拟机实例名称> <系统镜像名称、别名(可选)>
```

创建一个名为Ubuntu的虚拟机实例，默认使用最新版ubuntu 24.04镜像，此种方式不推荐

```
multipass launch --name node02 jammy
```

更高级的或更实用的创建方式如下：

> 创建4核心、4GB内存、100G虚拟磁盘的Ubuntu实例


```
multipass launch --name master -c 4 -m 4G -d 100G
```

```
-n, --name: 虚拟机名称
-c, --cpus: cpu核心数, 默认: 1
-m, --mem: 内存大小, 默认: 1G
-d, --disk: 硬盘大小, 默认: 5G
```

查看虚拟机列表
虚拟机创建完成后，可以使用multipass list命令进行查看虚拟机列表

> 可以看到虚拟机详细信息，名称，状态，地址，镜像名称等信息。

```
multipass list
```

此时可以看到目前正在运行的虚拟机，并且对应的IP地址为10.220.xxx.xxx，注意：此IP地址局域网内不能被访问

```
root@ubuntu:~# multipass list
Name                    State             IPv4             Image
foo                     Running           10.220.232.121   Ubuntu 24.04 LTS
v1                      Running           10.220.232.227   Ubuntu 24.04 LTS
vm1                     Running           10.220.232.188   Ubuntu 22.04 LTS
```

查看虚拟机信息
通过multipass info 虚拟机名称命令，查看当前运行的虚拟机信息

```
root@ubuntu:~# multipass info foo
Name:           foo
State:          Running
Snapshots:      0
IPv4:           10.220.232.121
Release:        Ubuntu 24.04 LTS
Image hash:     182dc760bfca (Ubuntu 24.04 LTS)
CPU(s):         1
Load:           0.11 0.04 0.01
Disk usage:     1.7GiB out of 4.8GiB
Memory usage:   400.0MiB out of 956.1MiB
Mounts:         --
```

进入虚拟机
通过multipass exec 虚拟机名称 执行命令方式，在实例内执行给定的命令

```
multipass exec foo bash
```

删除和释放实例
使用以下命令，可以开启、停止、删除和释放实例

```
# 启动vm实例
multipass start vm

# 停止vm实例
multipass stop vm
# 停止全部虚拟机
multipass stop --all

# 删除vm实例(删除后，还存在)
multipass delete vm

# 释放实例(彻底删除)
multipass purge

```

初始化配置

> Multipass提供了--cloud-init选项，在创建虚拟机时，利用一个配置文件，启动初始化配置

创建config.yaml初始化配置文件

> 使用首次启动时运行命令，在初始化容器的时候，自动配置与更新软件源。

```yaml
#cloud-config 
runcmd:
  - sudo sed -i 's|http://archive.ubuntu.com/|http://mirrors.aliyun.com/|g' /etc/apt/sources.list.d/ubuntu.sources
  - sudo apt update -y
  - sudo apt upgrade -y

```

注意：

> 必须以 #cloud-config 开头，这是cloud-init 识别它的方式

```
multipass launch --name ubuntu --cloud-init config.yaml
```
这里使用了一个简单配置示例，更多配置，参考文档：[Cloud config examples](https://cloudinit.readthedocs.io/en/latest/reference/examples.html#)


虚拟机的调整
查看multipass set命令的使用说明:

```
root@ubuntu:~# multipass help set
Usage: multipass set [options] <key>[=<value>]
Set, to the given value, the configuration setting corresponding to the given key.

Some common settings keys are:
  - client.gui.autostart
  - local.driver
  - local.privileged-mounts

Use `multipass get --keys` to obtain the full list of available settings at any given time.

Options:
  -h, --help  显示命令行选项的帮助
  -v, --verbose   增加日志详细程度。重复 'v' 可获得更多细节。
                  最大详细程度需要 4 个 (或更多) 个 v,即 -vvvv。

参数:
  keyval          一个键,或一个键值对。键指定要配置的设置路径。
                  值是其预期值。如果只给出键,则会提示输入值。
```

获得当前可用设置的完整列表，发现有几个主要参数可以对虚拟机进行调整


```
root@ubuntu:~# multipass get --keys
client.gui.autostart
client.gui.hotkey
client.primary-name
local.bridged-network
local.driver
local.foo.cpus
local.foo.disk
local.foo.memory
local.image.mirror
local.passphrase
local.privileged-mounts
local.ubuntu.cpus
local.ubuntu.disk
local.ubuntu.memory
local.v1.cpus
local.v1.disk
local.v1.memory
local.vm1.cpus
local.vm1.disk
local.vm1.memory
```

配置示例如下：
```
multipass set local.[实例名称].cpus=8
multipass set local.[实例名称].disk=300G
multipass set local.[实例名称].memory=8G
```

设置桥接网络接口
> 当创建一个虚拟机后，分配的IP地址并不是一个局域网地址，这会造成局域网其他电脑无法访问，因此设置网络为桥接模式，前提是有这个需求。


<!-- 

进入虚拟机后，可以看到目前虚拟机的一些系统配置信息，以及内存和磁盘的使用情况





## Multipass 安装

> 在官方网站：https://multipass.run/install 选择对应该的系统版本下载即可


## 简单使用


### 查看支持的系统镜像列表

```
multipass find
```


### 新建和运行ubuntu


> multipass launch --name <虚拟机实例名称> <系统镜像名称(可选)>

> 举例，比如创建一个名为 vm1 的虚拟机实例，不写系统镜像这个参数，则表示最新版ubuntu 24.04

```
multipass launch --name vm1
```


### 如何调用虚拟机？

```
multipass shell vm1
```


### 如何删除虚拟机实例

```

# 停止 vm1
multipass stop vm1

# 删除 vm1
multipass delete vm1

# 清理回收
multipass purge


# 附加


# 停止全部虚拟机
multipass stop --all

```


### 查看虚拟机列表


> 查看虚拟机列表 包括其状态（正在运行、已经删除的、已经停止的、标记未知状态的）
```
multipass list
```


## 进阶使用

### 自定义系统参数


```
multipass launch --name vm3 -c 4 -m 4G -d 300G
```


> vm3 虚拟机名称

> -c 4 代表虚拟4核心 这个要根据实际CPU核心数确定 不能随便写 比如本身2核心的cpu是无法虚拟4核心的

> -m 4G 代表虚拟4GB内存

> -d 300G 代表分配虚拟磁盘300GB


### 设置桥接模式的网络


```
multipass set local.bridged-network=name

# 比如重命名以太网为en0
multipass set local.bridged-network=en0
```

> name 就是网口的名称 比如 以太网，但是最好重命名为英文，比如en0、en1


### 创建桥接模式的虚拟机vm4

```
multipass launch --name vm4 -c 4 -m 4G -d 300G --network en0
```


> 笔记本电脑没有 有线网卡。只有Wifi 应该如何桥接呢？有时候，windows 下的multipass 可能打印不出wifi网卡。比如 输入 multipass networks


> 遇到识别不出wifi 网卡的情况，可以利用Hyper-V 管理器新建一个虚拟交换机。


> 打开hyper-v管理器。点击【虚拟交换管理器】-【新建虚拟网络交换机】-【外部】-【创建】 然后你勾选一下你的 wifi 无线网卡，然后 名称的话 改成英文吧，比如 en0 。这样应用之后，你再去打印multipass networks 就能识别wifi啦   -->