import process from 'node:process';
import axios from 'axios';
import Debug from 'debug';
import {getToken} from "./index.js";
import {filterNullParams, encryptWithModulus} from "./util.js";

const debug = Debug('scp::debug');

/**
 * 获取租户列表
 * @param {Object} params 查询参数
 *    - keywords    租户名关键字查询
 *    - az_id       资源池ID
 *    - az_type     资源池类型
 *    - dh_id       专属服务器组ID
 *    - enabled     租户是否启用 [0, 1]
 *    - sort        排序字段：sort=filed1[,filed2]
 *    - order_by    排序方式：ASC（默认）,DESC
 *    - fields      期望字段
 *    - page_num    请求页数
 *    - page_size   页面大小
 * @param {Object} options 环境选项
 * @returns
 */
export const list = async (params, options = {}) => {
  options.host = options.host || process.env.SCP_HOST;
  const token = await getToken(options)
  debug(`${options.host}/janus/20180725/projects`)
  const res = await axios.get(`${options.host}/janus/20190725/projects`, {
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
 * 获取租户详情
 * @param {string} project_id 租户ID
 * @param {Object} options 环境选项
 * @returns
 */
export const detail = async (project_id, options = {}) => {
  options.host = options.host || process.env.SCP_HOST;
  const token = await getToken(options)
  debug(`${options.host}/janus/20180725/projects/${project_id}`)
  const res = await axios.get(`${options.host}/janus/20180725/projects/${project_id}`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  })
  return res.data;
}

/**
 * 创建租户
 * @param {Object} project 创建参数
 *    - id            租户ID
 *    - name          租户名称
 *    - description   描述
 *    - parent_id     运营管理员id
 *    - {Object} project_admin 用户信息
 *          - user_id   用户ID
 *          - user_name 租户登录用户名
 *          - mail      用户邮箱地址
 *          - phone     电话号码 是
 *          - password  密码(加密后)
 * @param {Object} options 环境选项
 * @returns
 */
export const create = async (project, options = {}) => {
  let password_encrypt = ""
  await encryptWithModulus(project.project_admin.password, options).then(res => {
    password_encrypt = res
  })
  project.project_admin.password = password_encrypt
  options.host = options.host || process.env.SCP_HOST;
  const token = await getToken(options);
  debug(`${options.host}/janus/20180725/projects`);
  const res = await axios.post(`${options.host}/janus/20180725/projects`, {
    project,
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
 * 编辑租户
 * @param {Object} project 创建参数
 *    - id            租户ID
 *    - phone         租户电话号码
 *    - mail          租户邮箱地址
 *    - name          租户名称
 *    - description   描述
 *    - parent_id     要变更的上级租户id，运营模式下可用
 * @param {Object} options 环境选项
 * @returns
 */
export const update = async (project_id, project, options = {}) => {
  options.host = options.host || process.env.SCP_HOST;
  const token = await getToken(options);
  debug(`${options.host}/janus/20180725/projects/${project_id}`);
  project = filterNullParams(project);
  const res = await axios.put(`${options.host}/janus/20180725/projects/${project_id}`, {
    project,
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
 * 删除租户
 * @param {String} project_id 租户ID
 * @param {Object} options 环境选项
 * @returns
 */
export const remove = async (project_id, options = {}) => {
  options.host = options.host || process.env.SCP_HOST;
  const token = await getToken(options);
  debug(`${options.host}/janus/20180725/projects/${project_id}`);
  const res = await axios.delete(`${options.host}/janus/20180725/projects/${project_id}`, {
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": 'application/json',
    },
  }).catch(e => {
    console.log(e)
  });
  return res;
}

/**
 * 租户关联资源池
 * @param {String} project_id 租户ID
 * @param {Array} azs 资源池列表
 *    - az_id      资源池ID
 *    - dh_id      专属主机组ID
 * @param {Object} options 环境选项
 * @returns
 */
export const azs = async (project_id, azs, options = {}) => {
  options.host = options.host || process.env.SCP_HOST;
  const token = await getToken(options);
  debug(`${options.host}/janus/20180725/projects/${project_id}/azs`);
  const res = await axios.post(`${options.host}/janus/20180725/projects/${project_id}/azs`, {
    azs,
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
 * 租户解除关联资源池
 * @param {String} project_id 租户ID
 * @param {String} az_id      资源池ID
 * @param {Object} options 环境选项
 * @returns
 */
export const azsCancel = async (project_id, az_id,options = {}) => {
  options.host = options.host || process.env.SCP_HOST;
  const token = await getToken(options);
  debug(`${options.host}/janus/20180725/projects/${project_id}/azs/${az_id}`);
  const res = await axios.delete(`${options.host}/janus/20180725/projects/${project_id}/azs/${az_id}`, {
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
  detail,
  create,
  update,
  remove,
  azs,
  azsCancel,
};
