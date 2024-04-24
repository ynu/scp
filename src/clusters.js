import process from 'node:process';
import axios from 'axios';
import Debug from 'debug';
import {getToken} from "./index.js";
import {filterNullParams} from "./util.js";

const debug = Debug('scp::debug');

/**
 * 获取集群列表
 * @param {Object} params 查询参数
 *    - az_id 资源池ID
 *    - type 集群类型
 *    - name 集群名称
 * @param {Object} options 环境选项
 * @returns
 */
export const list = async (params, options = {}) => {
  options.host = options.host || process.env.SCP_HOST;
  const token = await getToken(options)
  debug(`${options.host}/janus/20180725/servers`)
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
 * 获取集群授权
 * @param {string} cluster_id 集群ID
 * @param {Object} options 环境选项
 * @returns
 */
export const licenses = async (cluster_id, options = {}) => {
  options.host = options.host || process.env.SCP_HOST;
  const token = await getToken(options)
  debug(`${options.host}/janus/20180725/licenses/clusters/${cluster_id}/summary`)
  const res = await axios.get(`${options.host}/janus/20180725/licenses/clusters/${cluster_id}/summary`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  }).catch(e => {
    console.log(e)
  })
  return res.data;
}

/**
 * 获取加密后的集群密码
 * @param {string} cluster_id 集群ID
 * @param {Object} options 环境选项
 * @returns
 */
export const password = async (cluster_id, options = {}) => {
  options.host = options.host || process.env.SCP_HOST;
  const token = await getToken(options)
  debug(`${options.host}/janus/20180725/clusters/${cluster_id}/password`)
  const res = await axios.get(`${options.host}/janus/20180725/clusters/${cluster_id}/password`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  }).catch(e => {
    console.log(e)
  })
  return res.data;
}

/**
 * 查询集群详情
 * @param {string} cluster_id 集群ID
 * @param {Object} options 环境选项
 * @returns
 */
export const detail = async (cluster_id, options = {}) => {
  options.host = options.host || process.env.SCP_HOST;
  const token = await getToken(options)
  debug(`${options.host}/janus/20180725/clusters/${cluster_id}`)
  const res = await axios.get(`${options.host}/janus/20180725/clusters/${cluster_id}`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  })
  return res.data;
}

export default {
  list,
  licenses,
  password,
  detail,
};
