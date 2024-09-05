# esxi 编译安装群晖
> 上文有介绍直接通过vmdk方式安装, 这次我们来看下如何通过巴西大神分享的编译安装

## arpl引导下载地址

链接: [arpl](https://github.com/fbelavenuto/arpl/releases)， 由于我用的是ESXI，避免不必要的转换，直接下载vmdk

https://github.com/RROrg/rr 地址更换为此，型号用的是DS3622XS+

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202306271126945.png)

## 登录ESXI，创建虚拟机

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202301171247832.png)

## 填入名称，选择其他(64位)

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202306271129630.png)

## 内存和CPU根据实际情况填写，删除默认添加的“硬盘”和“SCSI控制器0”

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202301171247519.png)

## 虚拟机选项 —— 引导选项中的固件选择为BIOS

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202301171247871.png)

## 点击完成，上传前面下载的vmdk文件

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202306271131773.png)

## 添加现有硬盘，选择刚刚上传的arpl,磁盘类型选择SATA 0:0，建议选择持久

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202306271135102.png)

## 添加新硬盘，磁盘类型选择SATA 0:1，大小看你准备多少用于NAS了，多块均可，建议选择持久

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202306271136195.png)

## 网络 —— vSwitch0 —— 编辑设置，将安全当中的 “混杂模式” “MAC 地址更改” “伪传输” 都改为 “安全”。 

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202301171248831.png)

## 启动虚拟机，打开控制台，会看到以下页面，可以通过页面当中显示的ip:7681地址访问，也可以直接在命令窗口输入 ./menu.sh 来编译

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202306271138414.png)

## 进入编译页面，第一步选择型号，按照需求选择（这里我选择了DS920+）

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202306271142826.png)

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202306271142258.png)

## 接着选择版本号，一般选择最新的就好

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202306271144032.png)

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202306271145429.png)


## 选择SN号，选择“Generate a random serial number”表示随机，选择“Enter a serial number"是手动输入SN号（一般要洗白才会用）

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202306271146587.png)

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202306271146556.png)


## 如果是在物理设备上且CPU的型号为10代以上的，可以通过“Addons”添加核显驱动，这里我们就直接跳过，选择“Build the loader”编译引导文件

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202306271221073.png)

## 编译过程中需要联网，会自动去群晖官网下载

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202306271221171.png)


## 编译结束后选择“boot the loader”

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202306271223506.png)

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202306271224334.png)

## 通过浏览器请求地址 http://ip:5000，进入群晖安装配置页面

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202306271226022.png)

## 选择Synology 下载中心，进入群晖官方下载页面，下载对应系统包

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202306271228447.png)

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202306271229680.png)

## 上传，待进度完即可

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202306271231603.png)


## 补充

> 1、我用的是k8s里的nginx转发，这样可以统一管理域名和ssl证书，实际过程中可能出现，IP地址访问可以登录，但是通过域名访问无法登陆的现象。这就需要进入 控制面板 -> 安全性 -> 信任的代理服务器 设置代理服务器IP

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202306271346731.png)