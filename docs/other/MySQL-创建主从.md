# MySQL创建主从

## 前置
### 所需条件
> 主库启用二进制日志log_bin
> 主句有设置一个全局唯一的ID号: server_id

```
# 主库
cat /etc/mysql/mysql.conf.d/mysqld.cnf

[mysqld]
server-id=110
log_bin

# 从库
cat /etc/mysql/mysql.conf.d/mysqld.cnf

[mysqld]
server-id=120
read_only=ON

```
> read_only=ON  设置数据库只读  #也可以不加，后面使用proxy代理时必须加此项，用于识别当前节点的用途

### 所需工具

> 主库和从库都得执行

```
apt-get update
# nc网络工具
apt-get install netcat -y 

# 安装 xtrabackup
# 获取安装源列表
wget https://repo.percona.com/apt/percona-release_latest.$(lsb_release -sc)_all.deb
# 安装下载的deb
dpkg -i percona-release_latest.$(lsb_release -sc)_all.deb
# 更新源
apt-get update
# 安装xtrabackup
apt-get install percona-xtrabackup-80 -y

```

## 从库停止数据库，删除数据目录
> 停止
```
systemctl stop mysql
```
> 然后进入到mysql的数据目录，执行清空
```
rm -rf /var/lib/mysql/
```

## 从库开启端口

```
nc -l -p 2112 | xbstream -x -C /var/lib/mysql
```

## 主库执行备份传输到远端
> 从库的nc命令设置好后，进入到主库的数据目录，执行xtrabackup进行备份。备份的时候使用管道|符号，进行nc传输，这里指定从库的ip地址和上面开通的端口号。

```
cd /var/lib/mysql
xtrabackup --defaults-file=/etc/mysql/my.cnf \--user=root --password='master_pass' \--socket=/run/mysqld/mysqld.sock  \--backup --parallel=4 --compress --compress-threads=4 --stream=xbstream --target-dir=./ | nc 192.168.252.13  2112
```
> 如果提示没有 BACKUP_ADMIN 权限， 登录主库，授权给对应用户
```
# 授权
grant BACKUP_ADMIN on *.* to 'root'@'%';
# 刷新
FLUSH PRIVILEGES;
```
>备份时，会在 Console 中打印相应的日志。备份成功之后，最后一样会显示 "completed OK!" 的字样，查看从库的目录，数据已经同步过来了

## 从库服务器进行解压
> 从节点上要对数据进行恢复。由于 Xtrabackup 备份传输过来的数据，都是 qp 压缩过的，所以要先解压。
```
xtrabackup --decompress --remove-original --parallel=4 --target-dir=/var/lib/mysql
```

## 从库服务器执行 prepare 操作。做数据预备
> xtrabackup要求在备份完成后执行prepare，以便应用任何未完成的日志并准备好启动数据库。建议在目标服务器上使用尽可能多的内存，以免导致内存耗尽

```
xtrabackup --prepare --use-memory=4G --target-dir=/var/lib/mysql
```

## 从库服务器修改目录权限
```
chown -R mysql:mysql /var/lib/mysql
```


## 创建主从

> 启动服务器
```
systemctl start mysql
```
> xtrabackup 备份后的数据，会有一个名为 xtrabackup_binlog_info 文件，里面记录了备份的 bin log 文件的名称及职位。我们可以通过这个文件，将从节点的 bin log 位置，设置成主节点的 bin log 位置。

> 登录 MySQL，执行从库创建命令。

```
mysql -uroot -p

# change master to master_host='主服务器 IP',master_user='master',master_password='master_pass',master_log_file='bin-log 文件名',master_log_pos=position;

# mysql> change master to master_host='192.168.252.11',master_user='root',master_password='master_pass',master_log_file='mysql-bin.000002',master_log_pos=157;

mysql > start slave;
mysql > show slave status;

```
> 在 slave 的状态中看到 Slave_IO_Running 和 Slave_SQL_Running 都为 Yes，表示从库已经连接到了主库，并且正在复制数据。

## TODO

目前主库迁移更改IP，从库似乎每次都得重新同步




