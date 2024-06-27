# mysql全量和增量备份 --- xtrabackup




> XtraBackup目前维护的大版本有两个(2.4和8.0)，之所以要维护两个版本，是因为MySQL 8.0中的redo log和数据字典的格式发生了变化。
>- XtraBackup 2.4，适用于MySQL 5.6和5.7。
>- XtraBackup 8.0。适用于 MySQL 8.0。

### 演示环境

| 服务 | 版本 |
|:------|:------|
| docker |  |
| docker-compose |  |


### 全量备份和恢复

运行的docker-compose.yml 如下

``` yaml
# 使用说明 V3
# docker-compose up
version: '3'
services:
  mysql-a:
    container_name: mysql-a
    hostname: mysql-a
    image: mysql:5.7.38
    restart: always
    ports:
      - 3307:3306
    environment:
      TZ: Asia/Shanghai
      MYSQL_ROOT_HOST: '%'
      MYSQL_ROOT_PASSWORD: shuqinkeji
      MYSQL_USER: test
      MYSQL_PASSWORD: shuqinkeji
    command:
      --default-authentication-plugin=mysql_native_password
      --max_connections=1000
      --character-set-server=utf8mb4
      --collation-server=utf8mb4_general_ci
      --default-time-zone='+8:00'
      --explicit_defaults_for_timestamp=true
      --lower_case_table_names=1
      --expire-logs-days=7
      # privileged: true
    logging:
      driver: "json-file"
      options:
        max-size: "100m"
    volumes:
      - ./data:/var/lib/mysql
      - ./logs:/var/log/mysql
      - ./conf/my.cnf:/etc/mysql/conf.d/my.cnf
      # - ./init:/docker-entrypoint-initdb.d

  mysql-b:
    container_name: mysql-b
    hostname: mysql-b
    image: mysql:5.7.38
    restart: always
    ports:
      - 3308:3306
    environment:
      TZ: Asia/Shanghai
      MYSQL_ROOT_HOST: '%'
      MYSQL_ROOT_PASSWORD: shuqinkeji
      MYSQL_USER: test
      MYSQL_PASSWORD: shuqinkeji
    command:
      --default-authentication-plugin=mysql_native_password
      --max_connections=1000
      --character-set-server=utf8mb4
      --collation-server=utf8mb4_general_ci
      --default-time-zone='+8:00'
      --explicit_defaults_for_timestamp=true
      --lower_case_table_names=1
      --expire-logs-days=7
      # privileged: true
    logging:
      driver: "json-file"
      options:
        max-size: "100m"
    volumes:
      - ./data-b:/var/lib/mysql
      - ./logs-b:/var/log/mysql
      # - ./conf/my.cnf:/etc/mysql/conf.d/my.cnf
      # - ./init:/docker-entrypoint-initdb.d
```
my.conf

```
[mysqld]
pid-file        = /var/run/mysqld/mysqld.pid
socket          = /var/run/mysqld/mysqld.sock
datadir         = /var/lib/mysql
secure-file-priv= NULL

#gtid:
server_id = 11                   #服务器id
gtid_mode = on                  #开启gtid模式
enforce_gtid_consistency = on   #强制gtid一致性，开启后对于特定create table不被支持

#binlog
log_bin = mysql-binlog
log_slave_updates = on
binlog_format = row             #强烈建议，其他格式可能造成数据不一致

#relay log
skip_slave_start = 1
```
(1). 查看mysql服务器所在网络  
>`docker inspect mysql-a` 
![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202406271043462.jpeg)
>另外还有个更简单的方式就是通过--host参数直接指定当前服务器ip来登录，免去了查看mysql docker网络的步骤
    
(2). my.cnf文件和datadir位置
>这个用来让xtrabackup可以实现文件复制
>如果是在虚拟机上搭建的msyql，需要用使用数据卷挂载，然后使用参数指定，例如:   
> `--defaults-file=/opt/xtrabackup/mysql_conf/my.cnf  --datadir=/data/mysql `  
> 如果是通过docker搭建的，可以使用参数来继承mysql容器的数据卷  
> `--volumes-from mysql-a`

(3). 备份之后的文件路径  
>这个是用来指定存放备份文件的路径
>由于使用docker运行，这里单独配置数据卷挂载  
>`... -v /data/database/backups:/backups ... --target-dir=/backups/base  ...`
4. 执行备份账号的权限


#### 执行备份账号的权限
> 官方文档：https://docs.percona.com/percona-xtrabackup/2.4/using_xtrabackup/privileges.html  
> 要点总结：
> * 无论使用xtrabackup还是innobackupex，都涉及两个参与者:调用程序的用户(系统用户)和在数据库服务器中执行操作的用户(数据库用户)。请注意，这些是不同位置的不同用户，即使它们可能具有相同的用户名。
> * 一旦连接到服务器，为了执行备份，您将需要在服务器的datadir的文件系统级别上的READ和EXECUTE权限。
> * 创建具有完整备份所需的最低权限的数据库用户的SQL示例如下:
``` sql
mysql> CREATE USER 'back'@'%' IDENTIFIED BY 'backups';
mysql> GRANT SELECT, RELOAD, LOCK TABLES, PROCESS, REPLICATION CLIENT ON *.* TO 'back'@'%';
mysql> FLUSH PRIVILEGES;
```

回到主题---备份、恢复

> 官方文档：https://docs.percona.com/percona-xtrabackup/2.4/backup_scenarios/full_backup.html#creating-a-backup
> 要点总结：
> * 要创建备份，使用xtrabackup --backup选项运行xtrabackup。您还需要指定一个xtrabbackup --target-dir选项，这是备份存储的位置，如果InnoDB数据或日志文件没有存储在相同的目录中，您可能也需要指定它们的位置。如果目标目录不存在，xtrabackup将创建它。如果该目录不存在且为空，则xtrabackup将成功。Xtrabackup不会覆盖现有的文件，它将失败，操作系统错误17，文件存在。
> * 日志复制线程每秒检查事务日志，以查看是否有需要复制的新日志记录写入，但是日志复制线程可能无法跟上写入事务日志的数量，并且在日志记录被覆盖之前可能会遇到错误。
> * 根据数据库的大小，备份可能需要很长时间。在任何时候取消都是安全的，因为它不会修改数据库。

基于docker 全量备份命令
```
docker run --rm --network mysql-compose_default  -v /data/database/backups:/backups --volumes-from mysql-a percona/percona-xtrabackup:2.4 \
xtrabackup --backup --target-dir=/backups/base  \
--host=mysql-a --port=3306 --user=back --password='backups'
```
说明:
```
--rm                                                                # 执行完就删除该容器
--network mysql-compose_default                                     # 指定和mysql-a在同一docker网络
-v /data/database/backups:/backups                                  # 挂载备份目录数据卷
--volumes-from mysql-a                                              # 继承 mysql-a数据卷
xtrabackup --backup --target-dir=/backups/base                      # xtrabackup全量备份命令
--host=mysql-a --port=3306 --user=back --password='backups'         # 数据库登陆信息和凭证（默认端口3306可以不指定）
```

#### 准备备份

> 官方文档：https://docs.percona.com/percona-xtrabackup/2.4/backup_scenarios/full_backup.html#preparing-a-backup

> 要点总结：  
> 
> 准备的意义  
> 在使用xtrabackup --backup选项进行备份之后，首先需要准备备份以便恢复。在准备好数据文件之前，它们在时间点上是不一致的，因为它们是在程序运行时的不同时间复制的，并且在此期间它们可能已经被更改了。如果您尝试用这些数据文件启动InnoDB，它将检测损坏并自行崩溃以防止您在损坏的数据上运行。xtrabackup --prepare步骤使文件在一个瞬间完全一致，因此您可以在它们上运行InnoDB。  
> 
> 准备注意事项：  
> (1).您可以在任何机器上运行准备操作;它不需要位于原始服务器或打算恢复到的服务器上。您可以将备份复制到实用程序服务器并在那里进行准备。  
> (2).不建议在准备备份时中断xtrabackup进程，否则可能导致数据文件损坏，导致备份无法使用。如果准备过程中断，则不保证备份的有效性。  
> (3).备份文件的准备只能执行一次  
> (4).在准备操作期间，xtrabackup启动了一种嵌入其中的修改过的InnoDB(它所链接的库)。这些修改对于禁用InnoDB的标准安全检查是必要的，例如抱怨日志文件大小不合适，这不适合与备份一起工作。这些修改只适用于xtrabackup二进制文件;你不需要一个修改过的InnoDB来使用xtrabackup进行备份。准备步骤使用这个内嵌的InnoDB对复制的数据文件执行崩溃恢复，使用复制的日志文件。准备步骤使用起来非常简单:你只需运行xtrabbackup --prepare option并告诉它准备哪个目录  
> 5.您可以使用较旧的Percona XtraBackup版本与较新的Percona XtraBackup版本准备备份，但反之亦然。在不受支持的服务器版本上准备备份应该使用支持该服务器版本的最新Percona XtraBackup版本。例如，如果使用Percona XtraBackup 1.6创建了MySQL 5.0的备份，那么使用Percona XtraBackup 2.3准备备份是不支持的，因为Percona XtraBackup 2.1删除了对MySQL 5.0的支持。相反，应该使用2.0系列中的最新版本。  
>
> 基于docker 准备命令
```
docker run --rm -v /data/database/backups:/backups percona/percona-xtrabackup:2.4 \
xtrabackup --prepare  --target-dir=/backups/base
```
> 根据注意事项可知，准备步骤是xtrabackup启动了一种嵌入其中的修改过的InnoDB，所以跟mysql服务器没有任何关系，这里只要关联备份目录即可，准备步骤也不一定要在备份服务器，可以拷贝到任何服务器进行准备

#### 恢复备份

> 官方文档：https://docs.percona.com/percona-xtrabackup/2.4/backup_scenarios/full_backup.html#restoring-a-backup

> 要点总结：
>
>* 在恢复备份之前，datadir必须为空。还需要注意的是，在执行恢复之前需要关闭MySQL服务器。您不能恢复到正在运行的mysqld实例的数据目录(除非导入部分备份（ Partial Backups）)。  
>* 如果不想保存备份，可以使用xtrabackup --move-back选项，该选项将把备份的数据移动到datadir中。迁移完要注意文件权限问题。  
>* 如果您不想使用上述任何选项，您可以另外使用rsync或cp来恢复文件。(例如在要恢复的mysql环境没有docker或者没有安装xtrabackup)  
> `rsync -avrP /data/backup/ /var/lib/mysql/`  
> 最后别忘记检查恢复的文件是否具有正确的所有权和权限。  
> * 非docker场景命令  
> `chown -R mysql:mysql /var/lib/mysql`  
> * docker场景命令  
> `chown -R lxd:docker docker容器data目录`  
>* 启用relay-log-info-repository=TABLE后，从备份中恢复的实例在错误日志中有错误，为了避免这些类型的问题，在CHANGE MASTER To之前启用relay_log_recovery或执行RESET SLAVE。
中继日志信息已经备份，但是创建了一个新的中继日志，这会在恢复期间造成不匹配。

基于docker 恢复命令，需要注意的是执行命令之前需要 关闭mysql docker容器，清空myql容器datadir目录，执行恢复命令，再启动mysql容器


```
# 这里是将数据恢复到mysql-b
# 停止mysql-b
docker stop mysql-b
# 清空mysql-b 的数据目录
rm -rf ./data-b/*
# 恢复数据到`data-b`目录
docker run --rm -v /data/database/backups:/backups --volumes-from mysql-b percona/percona-xtrabackup:2.4 \
xtrabackup --copy-back  --target-dir=/backups/base --datadir=/var/lib/mysql 
# 启动
docker start mysql-b
```
> 恢复要指定datadir，所以这里继承了mysql容器的数据卷，其他和mysql服务器没关系

还有一点要注意就是要关注恢复的mysql和导出的mysql版本是否不一致，不一致的话需要执行升级命令来兼容新版本

查看mysql版本命令  
`select version();`  
升级数据库命令  
`mysql_upgrade -uroot -p`  

***
***

### 增量备份和恢复

#### 创建

> 官方文档：https://docs.percona.com/percona-xtrabackup/2.4/backup_scenarios/incremental_backup.html#creating-an-incremental-backup  
>
> 要点总结：
> 
> * 必须有完整备份才能恢复增量更改。如果没有完整备份作为基础，增量备份就毫无用处。增量备份读取页面，并将它们的LSN与上次备份的LSN进行比较。增量备份不会将数据文件与前一次备份的数据文件进行比较。因此，在进行部分备份（Partial Backups）后再进行增量备份，可能导致数据不一致。 
> * 在本例中，您可以看到to_lsn(最后一个检查点LSN)和last_lsn(最后一次复制的LSN)之间存在差异，这意味着在备份过程中服务器上有一些流量。  

> 查看检查点文件  
`cat xtrabackup_checkpoints`

```
backup_type = incremental
from_lsn = 4124244
to_lsn = 6938371
last_lsn = 7110572
compact = 0
recover_binlog_info = 1
```

基于docker增量备份命令  
(1). 全量备份
```
docker run --rm --network mysql-compose_default  -v /data/database/backups:/backups --volumes-from mysql-a percona/percona-xtrabackup:2.4 \
xtrabackup --backup --target-dir=/backups/base  \
--host=mysql-a --port=3306 --user=back --password='backups'
```
(2). 增量备份（基于全量）
 ```
docker run --rm --network mysql-compose_default  -v /data/database/backups:/backups --volumes-from mysql-a percona/percona-xtrabackup:2.4 \
xtrabackup --backup --target-dir=/backups/inc1  --incremental-basedir=/backups/base \
--host=mysql-a --port=3306 --user=back --password='backups' 
```
(3). 增量备份（基于增量）
```
docker run --rm --network mysql-compose_default  -v /data/database/backups:/backups --volumes-from mysql-a percona/percona-xtrabackup:2.4 \
xtrabackup --backup --target-dir=/backups/inc2  --incremental-basedir=/backups/inc1 \
--host=mysql-a  --user=back --password='backups'
```
 

这步完成之后应该有以下目录
> /backups/base  
> /backups/inc1  
> /backups/inc2  

#### 准备

> 官方文档：https://docs.percona.com/percona-xtrabackup/2.4/backup_scenarios/incremental_backup.html#preparing-the-incremental-backups 
> 
> 要点总结：  
> 
> * 如果不使用xtrabackup --apply-log-only选项来防止回滚阶段，那么增量备份将是无用的。回滚事务后，不能应用进一步的增量备份。增量备份的xtrabackup --prepare步骤与完全备份不同。在完全备份中，执行两种类型的操作以使数据库保持一致:根据数据文件从日志文件重放已提交的事务，回滚未提交的事务。在准备增量备份时，必须跳过未提交事务的回滚，因为在备份时未提交的事务可能正在进行中，并且很可能在下一次增量备份中提交。您应该使用xtrabackup --apply-log-only选项来防止回滚阶段。   
> * 即使该操作跳过回滚阶段，也可以安全地恢复此备份。如果您恢复它并启动MySQL, InnoDB检测到回滚阶段没有执行，它将在后台执行回滚阶段。此操作与启动时的崩溃恢复相同。另外，MySQL会通知您数据库没有正常关闭。  
> * 在合并除最后一个增量之外的所有增量时，应该使用xtrabbackup --apply-log-only。这就是为什么前一行没有包含xtrabackup --apply-log-only选项的原因。即使在最后一步中使用了xtrabackup --apply-log-only，备份仍然是一致的，但是在这种情况下，服务器将执行回滚阶段。  
> * Percona XtraBackup不支持使用同一个增量备份目录准备两份备份。不要对同一个增量备份目录  (--incremental-dir的值)多次运行xtrabbackup --prepare命令。(大致原因应该是先做了准备，看不到准确的lsn？)  
> * 增量准备日志序列号应该与前面看到的基本备份的to_lsn匹配。  

(1). 准备全量备份
```
docker run --rm -v /data/database/backups:/backups percona/percona-xtrabackup:2.4 \
xtrabackup --prepare --apply-log-only --target-dir=/backups/base
```
> 根据要点 --apply-log-only 在增量备份准备步骤中必须存在，来阻止回滚步骤，最后一步准备步骤不用--apply-log-only这个参数，当然加了也可以，恢复步骤过后mysql日志会报错而已，数据是正常的

(2). 准备增量备份
```
docker run --rm -v /data/database/backups:/backups percona/percona-xtrabackup:2.4 \
xtrabackup --prepare --apply-log-only --target-dir=/backups/base --incremental-dir=/backups/inc1
```
> 这将增量文件应用于/data/backups/base中的文件，从而将它们向前滚到增量备份的时间。然后，它像往常一样对结果应用重做日志。注意--target-dir参数，最终数据在/data/backups/base目录下，而不是增量目录下.

(3). 准备增量备份2
```
docker run --rm -v /data/database/backups:/backups percona/percona-xtrabackup:2.4 \
xtrabackup --prepare --target-dir=/backups/base --incremental-dir=/backups/inc2
```
> 一旦准备好，增量备份与完整备份相同，并且可以以相同的方式恢复它们。

#### 恢复
可以参考：[恢复备份](#恢复备份)


### 压缩备份
#### 创建

> 官方文档：https://docs.percona.com/percona-xtrabackup/2.4/backup_scenarios/compressed_backup.html#creating-compressed-backups
>
> 要点总结：
> 
> * 为了进行压缩备份，你需要使用xtrabbackup -compress选项  
> * 如果你想加快压缩速度，你可以使用并行压缩，它可以通过xtrabbackup -compress-threads选项启用。  
> * 其实在以上创建备份步骤中加入 --compress --compress-threads=4 参数即可  
>
> 下面是创建全量压缩备份示例，创建增量压缩备份类似： 
```
docker run --rm --network mysql-compose_default  -v /data/database/backups:/backups --volumes-from mysql-a percona/percona-xtrabackup:2.4 \
xtrabackup --backup --compress --compress-threads=4 --target-dir=/backups/compressed/  \
--host=mysql-a --port=3306 --user=back --password='backups' 
```
> 
> 这里还有个疑问，就是文件都压缩了，增量备份的--incremental-basedir里的文件还能读到吗？
>
> 经过实测是不影响增量备份的，因为增量备份只读取xtrabackup_checkpoints里的信息，而xtrabackup_checkpoints文件是不压缩的 
>
> 下面再演示一个mysql是装在虚拟机非docker上的示例
```
docker run --rm -v /data/backups:/backups -v /etc/my.cnf:/etc/my.cnf -v /var/lib/mysql:/var/lib/mysql percona/percona-xtrabackup:2.4
xtrabackup --defaults-file=/etc/my.cnf --backup --compress --compress-threads=4 --target-dir=/backups/base --datadir=/var/lib/mysql
--host=192.168.252.17 --port=3306 --user=back --password='backups'
```
>
> 参数详解：
> 
> 这里挂载了宿主机的 my.cnf，/var/lib/mysql 数据卷，好让xtrabbackup读取到mysql服务器的文件
> 
> --defaults-file 参数必须放在第一个
> 
> --host参数必须写宿主机的ip地址，不能写127.0.0.1，否则会识别为容器内的地址
>
> 这里还有个坑需要提一下，就是我在实际备份时经常报错
> 
```
> InnoDB: Last flushed lsn: 3375345258517 load_index lsn 3379255303757  
> InnoDB: An optimized (without redo logging) DDLoperation has been performed. All modified pages may not have been flushed to the disk yet. 
PXB will not be able take a consistent backup. Retry the backup operation
```
> 后来，用压缩备份把压缩线程设置为4个 --compress-threads=4就不报错了  
> 个人分析原因可能是，写入数据速度太快，xtrabbackup读取和redo进程跟不上导致的，设置为4个线程，就跟上了
```
> InnoDB: Last flushed lsn: 3375345258517 load_index lsn 3379255303757
> InnoDB: An optimized (without redo logging) DDLoperation has been performed. All modified pages may not have been flushed to the disk yet. 
PXB will not be able take a consistent backup. Retry the backup operation
```
>
> xtrabackup在备份innoDB数据是，有2种线程：
>
> redo拷贝线程和ibd数据拷贝线程。
> 
> xtrabackup进程开始执行后，会启动一个redo拷贝的线程，用于从最新的checkpoint点开始顺序拷贝redo.log；再启动ibd数据拷贝线程，进行拷贝ibd数据。
但导致刷新redo 丢失的情况下，那备份就会失败  

> 刷新大量数据，或则 redo刷新跟不上  
> 导致刷新redo丢失的情况下，那备份就会失败  
> 参考文档：http://www.manongjc.com/detail/58-zcmrmijyfjvqazw.html  

#### 准备

> 官方文档：https://docs.percona.com/percona-xtrabackup/2.4/backup_scenarios/compressed_backup.html#preparing-the-backup
> 
> 要点总结：
> 
> * Xtrabackup --parallel可以与Xtrabackup --decompress选项一起使用，以同时解压缩多个文件。
> * Percona xtrabbackup不会自动删除压缩文件。为了清理备份目录，使用xtrabbackup --remove-original选项。如果使用xtrabackup --copy-back或xtrabackup --move-back，则未删除的文件不会被复制或移动到数据目录中。(也就是说解压后解压的文件和压缩文件在一个文件夹的问题)
> 
> 解压缩命令：
```
docker run --rm  -v /data/database/backups:/backups percona/percona-xtrabackup:2.4 \
xtrabackup --decompress --parallel=4 --target-dir=/backups/compressed/
```
>准备备份：
```
docker run --rm -v /data/database/backups:/backups percona/percona-xtrabackup:2.4 \
xtrabackup --prepare --target-dir=/backups/compressed/
```

#### 恢复

> 官方文档：https://docs.percona.com/percona-xtrabackup/2.4/backup_scenarios/compressed_backup.html#restoring-the-backup
> 
> 没什么好说的，和全量备份恢复步骤一样，需要注意的是这里建议用xtrabackup自带的恢复命令恢复，这样不会连压缩的文件一起拷贝出来，如果准备和恢复不在一个服务器，可以在准备的服务器上先用--copy-back 命令把恢复文件拷贝出来，再传到要恢复的服务器。迁移完要注意文件权限问题。
```
docker run --rm -v /data/database/backups:/backups --volumes-from mysql-b percona/percona-xtrabackup:2.4 \
xtrabackup --copy-back  --target-dir=/backups/compressed/ --datadir=/var/lib/mysql 
 ```
> 
> 参考文档：https://blog.csdn.net/omage/article/details/123532620

### 部分备份

> 官方文档：https://docs.percona.com/percona-xtrabackup/2.4/xtrabackup_bin/partial_backups.html?h=partial+backups
> 
> (1). 表备份  
> 
> Xtrabackup支持mysql服务器在启用innodb_file_per_table选项时进行部分备份。  
> 有三种方法可以创建部分备份:  
> 1.用正则表达式匹配表名  
> 2.在文件中提供表名列表  
> 3.提供数据库列表  

> 如果在备份过程中删除了任何匹配或列出的表，则xtrabackup将失败。
> 请勿复制已准备好的备份。恢复部分备份应该通过导入表来完成，而不是使用--copy-back选项。不建议在执行部分备份后再执行增量备份。
> 尽管在某些情况下可以通过复制文件来进行恢复，但在许多情况下，这可能会导致数据库不一致，因此不推荐使用这种方法。
>
> 第一种方法涉及到xtrabackup --tables选项。该选项的值是一个正则表达式，它以databasename.tablename的形式匹配完全限定的表名(包括数据库名)。
如果只备份test数据库中的表，可以使用如下命令:
```
$ xtrabackup --backup --datadir=/var/lib/mysql --target-dir=/data/backups/ \
--tables="^test[.].*"
```
>
> 只备份表test.T1时，可以使用如下命令:
>
``` 
$ xtrabackup --backup --datadir=/var/lib/mysql --target-dir=/data/backups/ \
--tables="^test[.]t1"
```
> 
> Xtrabackup --tables-file指定一个文件，该文件可以包含多个表名，文件中每行一个表名。只备份文件中指定的表。名称精确匹配，区分大小写，没有模式或正则表达式匹配。表名必须是完全限定的，在databasename中。表的格式。
> 
> (2). 库备份
> 
> Xtrabackup --databases接受一个以空格分隔的数据库和表的列表，以databasename[.tablename]格式进行备份。除了这个列表，确保指定mysql、sys和performance_schema数据库。在使用xtrabbackup—copy-back恢复数据库时需要这些数据库。
如果表是在备份开始后创建的，那么在-prepare步骤中处理的表也可以添加到备份中，即使它们没有被参数显式列出。
```
$ xtrabackup --databases='mysql sys performance_schema ...'
```
>
> Xtrabackup --databases-file指定一个文件，该文件可以包含databasename[中的多个数据库和表。表名]形式，文件中每行一个元素名。名称精确匹配，区分大小写，没有模式或正则表达式匹配。
>
> (3).准备备份  
> 当您在部分备份上使用xtrabackup --prepare选项时，您将看到关于不存在的表的警告。这是因为这些表存在于InnoDB的数据字典中，但是对应的。ibd文件不存在。它们没有被复制到备份目录中。这些表将从数据字典中删除，当您恢复备份并启动InnoDB时，它们将不再存在，并且不会导致任何错误或警告打印到日志文件中。

### 备份脚本

一共需要三个脚本：

全量备份脚本：full-backup-mysql.sh

增量备份脚本：incremental-backup-mysql.sh

文件同步脚本：rsync.sh

![](https://cdn.jsdelivr.net/gh/callac/markdown-image@main/img/202403081703296.png)

full-backup-mysql.sh 内容如下：
> 
> * 备份成功自动调用rsync.sh文件同步脚本
> * 脚本带有部分备份命令，需要备份指定库可以调整注释
> * 脚本会删除一个星期前的全量备份文件
> * 脚本会删除所有的增量备份文件
```bash
#!/bin/sh
#########################################################################
## Description: Mysql全量备份脚本
## File Name: full-backup-mysql.sh
## Author: lol
## mail:
## Created Time: 2023年11月23日
##########################################################################
today=`date +%Y%m%d`
datetime=`date +%Y%m%d-%H-%M-%S`
dockerNetwork=mysql-compose_default
basePath=/data/backups/data
dockerName=mysql-a
HOST=mysql-a
PORT=3306
USER=back
PASSWD=backups
logfilePath=$basePath
logfile=$logfilePath/full_$datetime.log



pid=`ps -ef | grep -v "grep" |grep -i xtrabackup|awk '{print $2}'|head -n 1`
if [ -z $pid ]
then

  echo " start full backup database " >> $logfile
  OneWeekAgo=`date -d "1 week ago"  +%Y%m%d`
  path=$basePath/full_$datetime
  mkdir -p $path
  last_backup=`cat $logfilePath/last_backup_sucess.log| head -1`
  echo " last backup is ===> " $last_backup >> $logfile
  
#----------Partial Backups-----------
docker run --rm --network $dockerNetwork -v $basePath:$basePath --volumes-from $dockerName percona/percona-xtrabackup:2.4 \
xtrabackup --backup --target-dir=$path \
--host=$HOST --port=$PORT --user=$USER --password=$PASSWD >> $logfile 2>&1

echo "docker run --rm --network $dockerNetwork -v $basePath:$basePath -v $dataDir:$dataDir --volumes-from $dockerName percona/percona-xtrabackup:2.4 \
xtrabackup --backup --target-dir=$path --datadir=$dataDir \
--host=$HOST --port=$PORT --user=$USER --password=$PASSWD "


#chown admin.docker $path -R

  ret=`tail -n 2 $logfile |grep "completed OK"|wc -l`
  if [ "$ret" =  1 ] ; then
    echo 'delete expired backup ' $basePath/full_$OneWeekAgo*  >> $logfile
    rm -rf $basePath/full_$OneWeekAgo*
    rm -f $logfilePath/full_$OneWeekAgo*.log
    rm -rf $basePath/incr_*
    rm -f $logfilePath/incr_*.log
    echo $path > $logfilePath/last_backup_sucess.log
    sh /data/backups/script/rsync.sh $logfile
  else
    echo 'backup failure ,no delete expired backup'  >> $logfile
  fi
else
   echo "****** xtrabackup in backup database  ****** "  >> $logfile
fi
```

incremental-backup-mysql.sh 内容如下：

> * 备份成功自动调用rsync.sh文件同步脚本
> 
> * 脚本带有部分备份命令，需要备份指定库可以调整注释
> 
> * 脚本会删除一个星期前的备份文件

``` bash
#!/bin/sh
#########################################################################
## Description: Mysql增量备份脚本
## File Name: incremental-backup-mysql.sh
## Author: lol
## mail:
## Created Time: 2023年11月23日
##########################################################################

today=`date +%Y%m%d`
datetime=`date +%Y%m%d-%H-%M-%S`
dockerNetwork=mysql-compose_default
basePath=/data/backups/data
dockerName=mysql-a
HOST=mysql-a
PORT=3306
USER=back
PASSWD=backups
logfilePath=$basePath
logfile=$logfilePath/full_$datetime.log



#dataBases="mysql sys performance_schema ..."

pid=`ps -ef | grep -v "grep" |grep -i xtrabackup|awk '{print $2}'|head -n 1`
if [ -z $pid ]
then
  echo " start incremental backup database " >> $logfile
  OneWeekAgo=`date -d "1 week ago"  +%Y%m%d`
  path=$basePath/incr_$datetime
  mkdir -p $path
  last_backup=`cat $logfilePath/last_backup_sucess.log| head -1`
  echo " last backup is ===> " $last_backup >> $logfile
#----------Partial Backups-----------


docker run --rm  --network $dockerNetwork -e TZ=Asia/Shanghai -v $basePath:$basePath  --volumes-from $dockerName percona/percona-xtrabackup:2.4 \
xtrabackup --backup --compress --compress-threads=4 --target-dir=$path --incremental-basedir=$last_backup \
--host=$HOST --port=$PORT --user=$USER --password=$PASSWD  >> $logfile 2>&1

#chown admin.docker $path -R

  ret=`tail -n 2 $logfile |grep "completed OK"|wc -l`
  if [ "$ret" =  1 ] ; then
    echo 'delete expired backup ' $basePath/incr_$OneWeekAgo*  >> $logfile
    rm -rf $basePath/incr_$OneWeekAgo*
    rm -f $logfilePath/incr_$OneWeekAgo*.log
    echo $path > $logfilePath/last_backup_sucess.log
    sh /data/backups/script/rsync.sh $logfile
  else
    echo 'backup failure ,no delete expired backup'  >> $logfile
  fi
else
   echo "****** xtrabackup in backup database  ****** "  >> $logfile
fi
```

 rsync.sh 内容如下

 ``` bash
 #!/bin/bash
datetime=`date +%Y%m%d-%H-%M-%S`
logfile=$1
echo "$datetime Rsync backup mysql start "  >> $logfile
rsync -e "ssh -p22" -avpgolr  --delete /data/backups bigtree@10.30.30.6:/data/backup_data/bigtree/DB_bak/10.30.30.8/ >> $logfile 2>&1

ret=`tail -n 1 $logfile |grep "total size"|wc -l`
if [ "$ret" =  1 ] ; then
        echo "$datetime Rsync backup mysql finish " >> $logfile
else
        echo "$datetime Rsync backup failure ,pls sendmail"  >> $logfile
fi
 ```

rsync脚本说明

> * 添加 --delete参数：这将删除只存在于目标目录、不存在于源目录的文件。  
> 这样可以让备份机器跟随源文件机器一起删除过期文件   
> 参考文档：https://zhuanlan.zhihu.com/p/572643499
> * 存放脚本的script目录在backups目录下，可以连脚本一起传输到备份机器，方便故障恢复
> * 需要在备份机器上新建账号bigtree，并只赋予备份目录权限，做对等性验证用于免密传输  
> 在备份机器上 新建账号  
> 参考文档：https://p3terx.com/archives/add-normal-users-with-adduser-and-useradd.html
>
> 
```
useradd -m -s /bin/bash bigtree
```
> 在被同步机器上新建备份目录  
>
> 
```
mkdir -p /data/backup_data/bigtree/DB_bak/10.30.30.8/
```
>并赋权
```
chown -R bigtree:bigtree /data/backup_data/bigtree 
```
>
> 在源文件机器上
>
> 对等性验证
>
> 参考文档：https://blog.csdn.net/qq_40006446/article/details/119951071
> 
> 产生密码文件，输入这个命令之后 一路回车  
```
ssh-keygen
```
> 拷贝这个密码文件到服务器主机上：  
```
ssh-copy-id -i ~/.ssh/id_rsa.pub bigtree@10.30.30.6
```
> 
> * 同步与被同步机器都要安装rsync  
> https://blog.csdn.net/weixin_46039745/article/details/132057919
>
> * rsync使用其他问题  
> https://cloud.tencent.com/developer/article/2038648

crontab -e 配置如下：

> 1.周日晚上3点全量备份  
> 2.周一至周六晚上3点增量备份  
> 3.这里使用root用户调用定时任务  
> 4.crontab知识补充：  
> https://zhuanlan.zhihu.com/p/594333950  
>
> https://crontab.guru/  
> 
> https://www.runoob.com/w3cnote/linux-crontab-tasks.html
```
SHELL=/bin/bash
PATH=/sbin:/bin:/usr/sbin:/usr/bin
MAILTO=root

# For details see man 4 crontabs

# Example of job definition:
# .---------------- minute (0 - 59)
# |  .------------- hour (0 - 23)
# |  |  .---------- day of month (1 - 31)
# |  |  |  .------- month (1 - 12) OR jan,feb,mar,apr ...
# |  |  |  |  .---- day of week (0 - 6) (Sunday=0 or 7) OR sun,mon,tue,wed,thu,fri,sat
# |  |  |  |  |
# *  *  *  *  * user-name  command to be executed


0 3 * * mon-sat sh /data/backups/script/incremental-backup-mysql.sh
0 3 * * sun sh /data/backups/script/full-backup-mysql.sh
```

## 创建主从
> xtrabackup 备份后的数据，会有一个名为 xtrabackup_binlog_info 文件，里面记录了备份的 bin log 文件的名称及职位。
>
> 我们可以通过这个文件，将从节点的 bin log 位置，设置成主节点的 bin log 位置。
> 登录 MySQL，执行从库创建命令
```

# 创建从库的权限需要改一下。 将CLIENT 换成 SLAVE 

mysql> CREATE USER 'back'@'%' IDENTIFIED BY 'backups';
mysql> GRANT SELECT, RELOAD, LOCK TABLES, PROCESS, REPLICATION SLAVE ON *.* TO 'back'@'%';
mysql> FLUSH PRIVILEGES;



mysql > change master to master_host='主服务器 IP',master_user='master',master_password='master_pass',master_log_file='bin-log 文件名',master_log_pos=position;
mysql > start slave;
mysql > show slave status\G;
```
> 在 slave 的状态中看到 Slave_IO_Running 和 Slave_SQL_Running 都为 Yes，表示从库已经连接到了主库，并且正在复制数据。

