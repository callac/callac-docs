      
# multipass


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


> 打开hyper-v管理器。点击【虚拟交换管理器】-【新建虚拟网络交换机】-【外部】-【创建】 然后你勾选一下你的 wifi 无线网卡，然后 名称的话 改成英文吧，比如 en0 。这样应用之后，你再去打印multipass networks 就能识别wifi啦 