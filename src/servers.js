import process from 'node:process';
import axios from 'axios';
import Debug from 'debug';
import {getToken} from "./index.js";
import {filterNullParams} from "./util.js";

const debug = Debug('scp::debug');

/**
 * 获取云主机列表信息
 * @param {Object} params 查询参数
 *    - vmtype  云主机类型                     - network_type  网络类型   - vpc_id  vpc网络id  - floating_ip_address 弹性ip地址
 *    - floatingip_id 弹性ip id               - type 平台类型            - status 云主机状态   - project_id 租户id
 *    - user_id 用户id                        - az_id 资源池id           - host_id 物理主机id - group_id 分组id
 *    - storage_id 云主机系统盘所在存储id         - os_type 操作系统类型      - has_tag 云主机标签  - tag_id 云主机标签id
 *    - in_protection 是否加入了容灾计划 [0, 1]  - protection_id 容灾计划id  - protection_type 容灾计划类型
 *    - power_state 云主机电源状态              - scale_group_id 伸缩组id   - expire_time 云主机过期时间，格式为 %Y-%m-%d %H:%M:%S
 *    - has_gpu 是否gpu云主机 [0, 1]           - gpu_type 显卡类型         - vm_ids 云主机id列表(20190725新增加查询参数)
 *    - storage_ids 存储id列表(20190725新增加查询参数)     - ids 云主机id列表，逗号分割的字符串 (20190725新增加查询参数)
 * @param {Object} options 环境选项
 * @returns
 */
export const list = async (params, options = {}) => {
  options.host = options.host || process.env.SCP_HOST;
  const token = await getToken(options);
  debug(`${options.host}/janus/20190725/servers`);
  const res = await axios.get(`${options.host}/janus/20190725/servers`, {
    headers: {
      Authorization: `Token ${token}`,
    },
    params: filterNullParams(params)
  }).catch(e => {
    console.log(e)
  });
  return res.data;
}

/**
 * 获取云主机配置信息
 * @param {string} server_id 集群ID
 * @param {Object} options 环境选项
 * @returns
 */
export const config = async (server_id, options = {}) => {
  options.host = options.host || process.env.SCP_HOST;
  const token = await getToken(options);
  debug(`${options.host}/janus/20190725/servers/${server_id}`);
  const res = await axios.get(`${options.host}/janus/20190725/servers/${server_id}`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  }).catch(e => {
    console.log(e)
  });
  return res.data;
}

/**
 * 创建云主机
 * @param {Object} params 创建参数
 *    - name  云主机名称             - cores  CPU总核数                  - sockets  socket数目   - memory_mb 内存大小(MB)
 *    - disks 磁盘信息              - networks 网络信息                  - image_id 镜像ID       - az_id 资源池ID
 *    - dh_id 专属服务器组ID         - description 云主机描述 Len < 100    - group_id 云主机分组    - count 云主机数量
 *    - type 云主机类型              - uuids 云主机UUID列表               - storage_tag_id 存储标签ID
 *    - storage_id 存储ID           - location 运行位置                 - power_on 是否创建完之后开机
 *    - cdroms 光驱信息             - usbs USB信息                      - advance_param 超融合高级参数
 *    - password 云主机密码          - floatingip 弹性公网IP创建信息       - hostname 云主机hostname Len < 100
 *    - lifespan 云主机失效时间       - hostname_index 云主机hostname后缀起始值     - encryption 加密信息
 *    - gpu GPU配置信息              - keypair 密钥信息                 - project_id 租户ID       - user_id 用户ID
 * @param {Object} options 环境选项
 * @returns
 */
export const create = async (params, options = {}) => {
  options.host = options.host || process.env.SCP_HOST;
  const token = await getToken(options);
  debug(`${options.host}/janus/20180725/servers`);
  const res = await axios.post(`${options.host}/janus/20180725/servers`, {
    ...params,
  },{
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": 'application/json',
    },
  }).catch(e => {
    console.log(e)
  });
  return res.data;
}

/**
 * 编辑云主机
 * @param {String} server_id 云主机UUID
 * @param {Object} params 修改参数
 *    - name  云主机名称           - description 云主机描述 Len < 100     - group_id 云主机分组    - cores  CPU总核数
 *    - sockets  socket数目      - memory_mb 内存大小(MB)               - os_type 操作系统类型    - storage_location 存储位置
 *    - location 运行位置         - hard_delete_disks  彻底删除的磁盘列表  - data_erase_disks 进行数据擦除的磁盘列表
 *    - disks 磁盘信息            - networks 网络信息                    - cdroms 光驱信息        - usbs USB信息
 *    - advance_param 超融合高级参数     - gpu GPU配置信息
 * @param {Object} options 环境选项
 * @returns
 */
export const update = async (server_id, params, options = {}) => {
  options.host = options.host || process.env.SCP_HOST;
  const token = await getToken(options);
  debug(`${options.host}/janus/20180725/servers/${server_id}`);
  const res = await axios.put(`${options.host}/janus/20180725/servers/${server_id}`, {
    server_id,
    ...params,
  },{
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": 'application/json',
    },
  }).catch(e => {
    console.log(e)
  });
  return res.data;
}

/**
 * 删除云主机
 * @param {String} server_id 云主机UUID
 * @param {Object} params 其它参数
 *    - force  是否彻底删除，1表示彻底删除，0表示软删除
 * @param {Object} options 环境选项
 * @returns
 */
export const remove = async (server_id, params, options = {}) => {
  options.host = options.host || process.env.SCP_HOST;
  const token = await getToken(options);
  debug(`${options.host}/janus/20180725/servers/${server_id}`);
  const res = await axios.delete(`${options.host}/janus/20180725/servers/${server_id}`, {
    data: {
      ...params
    },
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": 'application/json',
    },
  }).catch(e => {
    console.log(e)
  });
  return res.data;
}

/**
 * 启动云主机
 * @param {String} server_id 云主机UUID
 * @param {Object} options 环境选项
 * @returns
 */
export const start = async (server_id, options = {}) => {
  options.host = options.host || process.env.SCP_HOST;
  const token = await getToken(options);
  debug(`${options.host}/janus/20180725/servers/${server_id}/start`);
  const res = await axios.post(`${options.host}/janus/20180725/servers/${server_id}/start`, {

  },{
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": 'application/json',
    },
  }).catch(e => {
    console.log(e)
  });
  return res.data;
}

/**
 * 关闭云主机
 * @param {String} server_id 云主机UUID
 * @param {Object} options 环境选项
 * @returns
 */
export const stop = async (server_id, options = {}) => {
  options.host = options.host || process.env.SCP_HOST;
  const token = await getToken(options);
  debug(`${options.host}/janus/20180725/servers/${server_id}/stop`);
  const res = await axios.post(`${options.host}/janus/20180725/servers/${server_id}/stop`, {

  },{
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": 'application/json',
    },
  }).catch(e => {
    console.log(e)
  });
  return res.data;
}

/**
 * 重启云主机
 * @param {String} server_id 云主机UUID
 * @param {Object} options 环境选项
 * @returns
 */
export const reboot = async (server_id, options = {}) => {
  options.host = options.host || process.env.SCP_HOST;
  const token = await getToken(options);
  debug(`${options.host}/janus/20180725/servers/${server_id}/reboot`);
  const res = await axios.post(`${options.host}/janus/20180725/servers/${server_id}/reboot`, {

  },{
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": 'application/json',
    },
  }).catch(e => {
    console.log(e)
  });
  return res.data;
}

/**
 * 分配云主机
 * @param {String} server_id 云主机UUID
 * @param {String} project_id 租户ID
 * @param {Object} params 其它参数
 *    - user_id  用户id
 * @param {Object} options 环境选项
 * @returns
 */
export const allocation = async (server_id, project_id, params, options = {}) => {
  options.host = options.host || process.env.SCP_HOST;
  const token = await getToken(options);
  debug(`${options.host}/janus/20190725/servers/${server_id}/allocation`);
  const res = await axios.post(`${options.host}/janus/20190725/servers/${server_id}/allocation`, {
    project_id,
    ...params,
  },{
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": 'application/json',
    },
  }).catch(e => {
    console.log(e)
  });
  return res.data;
}

/**
 * 克隆云主机
 * @param {String} server_id 云主机UUID
 * @param {Object} params 其它参数
 *    - name  云主机名称             - power_on 克隆后是否开机，可选值为[0,1]    - count 克隆台数
 *    - description  描述信息        - storage_tag_id 存储标签ID              - compute_location_id 运行位置ID
 *    - storage_location 存储位置    - group_id  克隆后所属分组                - advance_param 额外参数
 *    - clone_type 克隆方式
 * @param {Object} options 环境选项
 * @returns
 */
export const clone = async (server_id, params, options = {}) => {
  options.host = options.host || process.env.SCP_HOST;
  const token = await getToken(options);
  debug(`${options.host}/janus/20180725/servers/${server_id}/clone`);
  const res = await axios.post(`${options.host}/janus/20180725/servers/${server_id}/clone`, {
    ...params,
  },{
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": 'application/json',
    },
  }).catch(e => {
    console.log(e)
  });
  return res.data;
}

/**
 * 迁移云主机
 * @param {String} server_id 云主机UUID
 * @param {Object} params 其它参数
 *    - az_id  迁移到的az_id
 *    - dh_id  迁移到的专属服务器组
 *    - storage_location 迁移后的存储位置
 *    - auto_poweron 迁移后是否自动开机
 *    - auto_shutdown 是否自动关闭源端云主机以完成迁移（从vmware迁移到hci特有参数）
 *    - networks 迁移后的网络参数（从vmware迁移到hci特有参数）
 * @param {Object} options 环境选项
 * @returns
 */
export const migrate = async (server_id, params, options = {}) => {
  options.host = options.host || process.env.SCP_HOST;
  const token = await getToken(options);
  debug(`${options.host}/janus/20190725/servers/${server_id}/migrate`);
  const res = await axios.post(`${options.host}/janus/20190725/servers/${server_id}/migrate`, {
    ...params,
  },{
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": 'application/json',
    },
  }).catch(e => {
    console.log(e)
  });
  return res.data;
}

/**
 * 从回收站恢复云主机
 * @param {String} server_id 云主机UUID
 * @param {Object} options 环境选项
 * @returns
 */
export const restore = async (server_id, options = {}) => {
  options.host = options.host || process.env.SCP_HOST;
  const token = await getToken(options);
  debug(`${options.host}/janus/20180725/servers/${server_id}/restore`);
  const res = await axios.post(`${options.host}/janus/20180725/servers/${server_id}/restore`, {

  },{
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": 'application/json',
    },
  }).catch(e => {
    console.log(e)
  });
  return res.data;
}

/**
 * 挂起云主机
 * @param {String} server_id 云主机UUID
 * @param {Object} options 环境选项
 * @returns
 */
export const suspend = async (server_id, options = {}) => {
  options.host = options.host || process.env.SCP_HOST;
  const token = await getToken(options);
  debug(`${options.host}/janus/20180725/servers/${server_id}/suspend`);
  const res = await axios.post(`${options.host}/janus/20180725/servers/${server_id}/suspend`, {

  },{
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": 'application/json',
    },
  }).catch(e => {
    console.log(e)
  });
  return res.data;
}

/**
 * 云主机控制台
 * @param {String} server_id 云主机UUID
 * @param {Object} remote_console 云主机控制台信息
 *  - protocol 云主机控制台协议(传vnc)
 *  - type     云主机控制台种类(传novnc)
 * @param {Object} options 环境选项
 * @returns
 */
export const remoteConsoles = async (server_id,remote_console, options = {}) => {
  options.host = options.host || process.env.SCP_HOST;
  const token = await getToken(options);
  debug(`${options.host}/janus/20180725/servers/${server_id}/remote-consoles`);
  const res = await axios.post(`${options.host}/janus/20180725/servers/${server_id}/remote-consoles`, {
    remote_console
  },{
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": 'application/json',
    },
  }).catch(e => {
    console.log(e)
  });
  return res.data;
}

/**
 * 云主机批量操作
 * @param {String[]} server_ids 云主机id列表
 * @param {Object} server_action 云主机操作
 *  - agent_action               agent操作
 *  - soft_del_servers_action    批量删除云主机
 *  - stop_servers_action        批量关闭云主机
 *  - poweroff_servers_action    批量关闭云主机电源
 *  - reboot_servers_action      批量重启云主机
 *  - suspend_servers_action     批量挂起云主机
 *  - start_servers_action       批量开启云主机
 * @param {Object} options 环境选项
 * @returns
 */
export const action = async (server_ids,server_action, options = {}) => {
  options.host = options.host || process.env.SCP_HOST;
  const token = await getToken(options);
  debug(`${options.host}/janus/20180725/servers/action`);
  const res = await axios.post(`${options.host}/janus/20180725/servers/action`, {
    server_ids,
    server_action,
  },{
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": 'application/json',
    },
  }).catch(e => {
    console.log(e)
  });
  return res.data;
}

/**
 * 从备份恢复云主机
 * @param {String} server_id 云主机ID
 * @param {String} backup_id 备份ID
 * @param {Object} params 其它参数
 *  - recover_type               恢复方式，新建/覆盖，Enum(‘create’, ‘cover’)
 *  - name                       生成的云主机名称，只有新建恢复才需要,覆盖恢复不支持
 *  - iolog                      如果从cdp恢复云主机，需要传入iolog_id
 *  - power_on                   恢复后是否启动，默认启动
 *  - group_id                   新建恢复支持指定group_id,覆盖恢复不支持
 *  - dh_id                      专属服务器组ID
 *  - storage_tag_id             恢复的存储位置
 *  - storage_id                 恢复的存储id
 *  - location                   恢复的运行位置,如host-xx,cluster
 * @param {Object} options 环境选项
 * @returns
 */
export const backupRecover = async (server_id,backup_id, params, options = {}) => {
  options.host = options.host || process.env.SCP_HOST;
  const token = await getToken(options);
  debug(`${options.host}/janus/20180725/servers/${server_id}/backups/${backup_id}/recover`);
  const res = await axios.post(`${options.host}/janus/20180725/servers/${server_id}/backups/${backup_id}/recover`, {
    server_id,
    backup_id,
    ...params,
  },{
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": 'application/json',
    },
  }).catch(e => {
    console.log(e)
  });
  return res.data;
}

export default {
  list,
  config,
  create,
  update,
  remove,
  start,
  stop,
  reboot,
  allocation,
  clone,
  migrate,
  restore,
  suspend,
  remoteConsoles,
  action,
  backupRecover,
};
