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
