# PVE 中虚机磁盘扩容
## 磁盘扩容

> 进入系统，查看磁盘使用量
```
df -h
```
![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202402291513023.png)

> 查看磁盘类型
```
lsblk
```
![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202402291514176.png)

> 根据磁盘类型扩容，目前机器上只挂载了两种，lvm和disk类型
## lvm 磁盘扩容
> 例如图中，我们要对根目录扩容

### 登录并打开pve管理页面，增加磁盘容量
> 首先查看是否有多余空间, Disks -> LVM-Thin

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202402291515008.png)

> 进入控制台对应虚拟机页面， 虚拟机 -> Hardware

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202402291516738.png)

> 选中对应Hard Disk条目 点击 Resize Disk，下图中演示的是增加10G(实际情况要根据业务调整大小值)，点击Resize disk

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202402291516255.png)

> 通过命令可以看到对应磁盘已经增加，但是还没有增加到指定分区

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202402291516288.png)

### 虚拟机中扩容

```
fdisk /dev/sda
```

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202402291517554.png)

```
#再次查看，出现sda4
lsblk -l
```
![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202402291517619.png)

```
#创建pv
pvcreate /dev/sda4
```
![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202402291517103.png)
```
#将/dev/sda4 加入ubuntu-vg vg中
vgextend ubuntu-vg /dev/sda4
```
![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202402291517587.png)

```
#可以看到新加硬盘在ubuntu-vg 中
pvdisplay
```

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202402291518818.png)

```
#扩容lvm，将剩余空间都给 / 路径
lvextend -l +100%FREE /dev/mapper/ubuntu--vg-ubuntu--lv
```
![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202402291518466.png)

```
#刷新 / 路径所在文件系统
resize2fs /dev/mapper/ubuntu--vg-ubuntu--lv
```
![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202402291519765.png)

```
#再次查看，扩容已完成
df -h
```
![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202402291519748.png)

## disk 磁盘扩容

> 对disk /dev/sdb扩容

### pve中操作

> 选中对应Hard Disk条目 点击 Resize Disk，下图中演示的是增加20G(实际情况要根据业务调整大小值)，点击Resize disk

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202402291519165.png)

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202402291519947.png)

### 虚拟机中操作扩容

>通过命令可以看到对应磁盘已经增加，但是还没有增加到指定分区

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202402291520114.png)

```
#刷新 /home/jinzong 路径所在文件系统
xfs_growfs /home/jinzong
```
![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202402291520448.png)

```
#再次查看，扩容已完成
df -h
```
![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202402291520730.png)
