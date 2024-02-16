

# PVE到ESXi的虚拟机迁移操作

## 迁移前注意事项  
> 确保导出的位置有足够空间，我这里显示的/mnt/pve/data 还有2.2T，所以后续导出的目录都在/mnt/pve/data下

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202402161023433.PNG)

## PVE 中进行
### SSH到PVE主机，进行Backup
> ssh  root@PVE_HOST_IP

```
vzdump <VMID1> <VMID2> --dumpdir /mnt/pve/data/dump/ --compress zstd
```

> 说明: - 以上的命令会在 /mnt/pve/data/dump/ 目录中以zstd压缩格式备份 \<VMID1\> \<VMID2\> 号虚拟机

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202402161033343.PNG)

### 备份完成后

> PVE内置的备份可以生成 VMA文件 (Proxmox Virtual Machine Archive)备份在目录/var/lib/vz/images下,PVE的web端并没有提供下载,可以ssh进入PVE进行导出操作备份后的文件,可以通过vma命令转换成raw.如果你备份时候选择了压缩,请先使用zstd解压

### 解压备份出来的文件
```
cd /mnt/pve/data/dump 
zstd -d vzdump-qemu-112-2024_02_07-14_56_33.vma.zst
```
![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202402161037586.PNG)

### 通过vma命令转换成raw后缀的磁盘文件

```
vma extract vzdump-qemu-112-2024_02_07-15_09_28.vma extract
```
![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202402161038238.PNG)

### 用qemu-img把raw转换vmdk，如果有多块磁盘得分别执行.

```
cd extract/
qemu-img convert -f raw -O vmdk disk-drive-scsi0.raw disk-drive-scsi0.vmdk
qemu-img convert -f raw -O vmdk disk-drive-scsi1.raw disk-drive-scsi1.vmdk
qemu-img convert -f raw -O vmdk disk-drive-scsi2.raw disk-drive-scsi2.vmdk
```
![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202402161040936.PNG)

### 把转换后的vmdk文件上传到ESXI服务器上
> 通过web页面或SCP 将文件传输到ESXI服务器上，这里建议用SCP，比较稳定

## ESXI 中进行
### 进入ESXI服务器中，再进行一次磁盘转换
> ssh到ESXi服务器上  
> ssh root@ESXi_HOST_IP   
> 找到上传的vmdk文件存放位置（网页端可以看到datastore的位置 /vmfs/volumes/649930cc-b54f8e72-287b-c81f66b8a8f0） 

```
cd /vmfs/volumes/649930cc-b54f8e72-287b-c81f66b8a8f0/pve 
vmkfstools -i disk-drive-scsi0.vmdk an11-scsi0.vmdk -d thin
vmkfstools -i disk-drive-scsi1.vmdk an11-scsi1.vmdk -d thin
vmkfstools -i disk-drive-scsi2.vmdk an11-scsi2.vmdk -d thin
```
> 说明: 【 -i 】作用是转换，【 -d thin 】作用是将新磁盘文件使用“精简置备模式”。 

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202402161043722.png)

### 转换完成之后，再在ESXi 服务器上新建虚拟机，最后一步的时候，把默认磁盘删掉，添加上传上去的磁盘文件作为虚拟机的磁盘即可。
> 创建虚拟机、设置自定义设置时，选择适合的配置，将原有的磁盘删除，添加“现有硬盘”，依次添加转为精简置备的多块盘

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202402161044322.png)

### 启动虚拟机
> 此时如果直接进入系统的话，会因为硬盘驱动的原因报错，解决方法是启动虚拟机后，立即到终端上立刻按下键，选择救援模式进入

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202402161045272.png)

> 通过账号密码进入系统

```
# 新增内核模块，支持vmware硬件
vim /etc/dracut.conf.d/drivers.conf
add_drivers+="vmxnet3 vmw_pvscsi"

# 使用dracut命令重新构建kernel
dracut --verbose --force
```

## 常见问题
### 网络问题
- pve迁移过来的虚拟机都带有 cloud-init ，在重启时它会修改网卡配置，所以我们将它卸载掉
```
rpm -e --nodeps cloud-init
```
- 在vcenter上查到新虚拟机的mac地址，将虚拟机中网络配置文件的mac地址替换，例如centos7的配置文件为/etc/sysconfig/network-scripts/ifcfg-eth0
- 修改之后重启服务器,选择与之匹配的内核启动即可

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202402161052332.png)

```
# centos 修改默认启动内核
# 查看当前系统中可用的内核列表
awk -F\' '$1=="menuentry " {print i++ " : " $2}' /etc/grub2.cfg

# 使用 grub2-set-default 命令来设置默认启动的内核。例如，如果你想要启动列表中的第1项，可以执行：
grub2-set-default 1

# 生成新的GRUB配置文件以应用更改：
grub2-mkconfig -o /boot/grub2/grub.cfg

# 重启系统以使更改生效。
reboot
```