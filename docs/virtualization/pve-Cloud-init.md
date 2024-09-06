# PVE 中虚机磁盘扩容

## 简介

> Cloud-init 是一个程序，它在启动时在客户机上运行，是用于 跨平台云实例初始化 的行业标准多分发方法。它支持所有主要的 公共云提供商、私有云基础设施的供应系统和裸机安装。


> Cloud-init 将识别在引导期间运行的云，从云中读取任何提供的 元数据，并相应地初始化系统。这可能涉及到设置网络、存储设备、配置 SSH 访问密钥和其他各种系统配置。之后，cloud-init 还将解析和处理传递给实例的任何可选用户或供应商数据。

> Proxmox VE Cloud-Init 支持
> Proxmox VE 支持 Cloud-init ，使用 Cloud-Init，就可以在管理程序端配置网络设备和 ssh 密钥。当 VM 第一次启动时，VM 中的 Cloud-Init 软件将应用这些设置。

## 准备 Cloud-Init 模板

> 许多发行版本已经提供了即时可用的 Cloud-Init 映像，所以你也可以直接下载和导入这样的镜像。

`Ubuntu 镜像中心: ` https://cloud-images.Ubuntu.com

`Centos 镜像中心: ` http://cloud.centos.org/centos

`Debian 镜像中心: ` http://cdimage.debian.org/cdimage/cloud/OpenStack/

> 在下面的例子中，我们将使用 [Ubuntu](https://cloud-images.Ubuntu.com) 中心提供的云映像
```
# 下载镜像
wget https://cloud-images.ubuntu.com/noble/current/noble-server-cloudimg-amd64.img

# 创建新的虚拟机
qm create 999999 --memory 2048 --net0 virtio,bridge=vmbr0

# 将下载好的磁盘镜像导入 local-lvm 存储
qm importdisk 999999 bionic-server-cloudimg-amd64.img local-lvm

# 最后将新的磁盘加载到虚拟机上作为 scsi 设备
qm set 999999 --scsihw virtio-scsi-pci --scsi0 local-lvm:vm-999999-disk-0
```

> Ubuntu Cloud-Init 映像需要 SCSI 驱动器的 virtio-SCSI-pci 控制器类型。 

> 注：经过实测，除了 importdisk 步骤外，其余步骤均可在 PVE 的 web 面板上完成，建议终端操作并观察 web 变化后，再尝试纯 web 界面操作。

添加 Cloud-Init CD-ROM 驱动器

> 下一步是配置 CD-ROM 驱动器，用于将 Cloud-Init 数据传递给 VM。

```
qm set 999999 --ide2 local-lvm:cloudinit
```

> 要能够直接从 Cloud-Init 映像引导，需要将引导磁盘参数设置为 scsi0 ，并将 BIOS 限制为仅从磁盘引导。这将加速引导，因为 VM BIOS 会跳过可引导 CD-ROM 的测试。

```
qm set 999999 --boot c --bootdisk scsi0
```
> 还要配置一个串行控制台并将其用作显示器。许多 Cloud-Init 映像都依赖于此，因为这是 OpenStack 映像的一个需求。

```
qm set 999999 --serial0 socket --vga serial0
```

> 在最后一个步骤中，将 VM 转换为模板会很有帮助。然后，您可以从这个模板快速创建链接克隆。从 VM 模板进行部署要比创建完整的克隆(副本)快得多。

```
qm template 999999
```

## 部署 Cloud-Init 模板

```
qm clone 999999 123 --name ubuntu2
```

> 然后配置用于身份验证的 SSH 公钥，并配置 IP 设置（可选）:

```
qm set 123 --sshkey ~/.ssh/id_rsa.pub
qm set 123 --ipconfig0 ip=192.168.253.123/24,gw=192.168.253.1
```

> 此外还可以配置 DNS 域等，更多配置项请查看 PVE 官网 [Cloud-Init Support](https://pve.proxmox.com/wiki/Cloud-Init_Support) 。

> 之后启动虚拟机，即可验证之前的配置是否生效。


## 关于qm命令

常用选项

```
qm create    # 创建新的虚拟机
qm start     # 启动虚拟机
qm stop      # 停止虚拟机
qm shutdown  # 优雅地关闭虚拟机
qm destroy   # 销毁虚拟机
qm list      # 列出所有虚拟机的状态
qm show      # 显示虚拟机的详细信息
qm config    # 显示或修改虚拟机的配置
qm migrate   # 迁移虚拟机到另一个节点
qm clone     # 克隆虚拟机

qm resize    # 调整虚拟机磁盘大小
qm snapshot  # 创建虚拟机快照
qm rollback  # 恢复到指定的快照状态
qm template  # 创建虚拟机模板
qm startall  # 启动所有虚拟机
qm stopall   # 停止所有虚拟机
qm move      # 移动虚拟机磁盘
qm cloneconfig  # 克隆虚拟机配置
qm status    # 显示虚拟机运行状态
qm reset     # 重置虚拟机状态

```

qm set

```
qm set <vmid> [OPTIONS]

General Options:
  --name <string>             设置虚拟机名称
  --memory <integer>          设置虚拟机内存大小（以MB为单位）
  --sockets <integer>         设置虚拟机CPU插槽数
  --cores <integer>           设置每个插槽的CPU核心数
  --numa <integer>            启用或禁用NUMA（0或1）
  --balloon <integer>         设置内存气球设备的目标内存大小（以MB为单位）

Boot Options:
  --boot <order>              设置启动顺序，例如 order=scsi0;net0
  --bootdisk <disk>           设置引导磁盘，例如 scsi0

Disk Options:
  --ide<n> <volume>           添加IDE磁盘，例如 local:iso/debian-10.0.iso
  --sata<n> <volume>          添加SATA磁盘，例如 local:iso/debian-10.0.iso
  --scsi<n> <volume>          添加SCSI磁盘，例如 local-lvm:vm-100-disk-0
  --virtio<n> <volume>        添加VirtIO磁盘，例如 local-lvm:vm-100-disk-0
  --cdrom <volume>            添加CD-ROM驱动器，例如 local:iso/debian-10.0.iso
  --delete <device>           删除设备，例如 --delete scsi0

Network Options:
  --net<n> <model>,bridge=<bridge>[,tag=<vlan>][,firewall=<1|0>]
                             添加网络设备，例如 virtio,bridge=vmbr0

Serial/USB Options:
  --serial<n> <model>         添加串行设备，例如 socket
  --usb<n> <host=<hostaddr>[,vendorid=<id>,productid=<id>,id=<id>]
                             添加USB设备

Display Options:
  --vga <type>                设置VGA卡类型，例如 std, qxl, serial0

Other Options:
  --agent <enabled=1|0>       启用或禁用QEMU Guest Agent
  --ciuser <username>         设置Cloud-init默认用户
  --cipassword <password>     设置Cloud-init默认用户密码
  --cicustom <key=volume>     设置Cloud-init自定义数据，例如 user=local:snippets/my-user-data.yaml
  --tags <string>             设置虚拟机标签

```

# 通过命令新建虚拟机


```
# 创建虚拟机
qm create 18139 --name Kylin-SP3 --cores 4 --memory 8192 --net0 virtio,bridge=vmbr0 
```
>  - ID 18139
>  - 名称 myvm​
>  - 内存2048MB​
>  - 网络：使用 virtio​ 网络接口，连接到 vmbr0​ 桥接网络
>  - CPU虚拟核心2​个

```
# 添加硬盘
查看存储池：
pvesm status

创建硬盘：
qm set 18139 --scsi0 local-lvm:100

```

>  - 硬盘配置：
>  - 来源：存储池local-lvm
>  - 容量：100GB​
>  - 硬盘格式：scsi0​
>  - 分配给：VM18139

```
# 查看配置：
qm config 18139

# 添加引导设备
# 准备好系统镜像
pvesm list local

#挂载到虚拟机的 CD/DVD 驱动器：
qm set 18139 --cdrom local:iso/Kylin-Server-V10-SP3-General-Release-2303-X86_64.iso

# 注意： 挂载后ide2就是CD/DVD驱动器

# 设置 CD/DVD 驱动器为第一引导项：
qm set 18139 --boot 'order=ide2;scsi0'

# 启动虚拟机：
qm start 18139

# 通过Web界面完成装机选项


#移除引导设备
qm set 18139 --boot order=scsi0
qm set 18139 --delete cdrom #移除CD/DVD

```