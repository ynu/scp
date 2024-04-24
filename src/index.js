import process from 'node:process';
import axios from 'axios';
import clusters from './clusters.js';
import servers from './servers.js';
import project from './projects.js';
import cache from "memory-cache";
import Debug from "debug";
import {encryptWithModulus} from "./util.js";
const debug = Debug('webscp:debug');
const warn = Debug('webscp:warn');


export class scpError extends Error {
  constructor (code, message) {
    super(message);
    this.message = message;
    this.code = code;
    this.data = null;
  }
}

/**
 * 获取token。
 * @param {Object} options 其他参数
 *    - username scp系统用户名
 *    - password scp系统密码(加密后的密码)
 * @returns 获得的Token
 */
export const getToken = async (options = {}) => {
  const host = options.host || process.env.SCP_HOST;
  const username = options.username || process.env.SCP_USERNAME;
  const password = options.password || process.env.SCP_PASSWORD;
  if (!username) {
    throw new scpError(-1, '必须的参数username或环境变量SCP_USERNAME(scp用户名)未设置.')
  }
  if (!password) {
    throw new scpError(-1, '必须的参数password未传入,或未设置环境变量SCP_PASSWORD')
  }

  const tokenCacheKey = `scp-token::${username}::${password}`;
  let token = cache.get(tokenCacheKey);
  let password_encrypt = ""
  await encryptWithModulus(password, options).then(res => {
    password_encrypt = res
  })
  if (token) {
    debug(`从cache获取token(password:${password})`);
    return token;
  } else {
    const res = await axios.post(`${host}/janus/authenticate`, {
        "auth": {
          "passwordCredentials": {
            "username": username,
            // 调用加密方法获得加密后的密码
            "password": password_encrypt
          }
        }
      }, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch(e => {
      console.log(e)
    });
    if (res.data.code === 0) {
      debug(`获取token成功::${res.data.data.access.token.id}`);
      // 过期时间为1800s, 过期时间减去30s, 防止token失效
      cache.put(tokenCacheKey, res.data.data.access.token.id, (1800*1000-30*1000));
      // console.log(cache.get(tokenCacheKey))
      return res.data.data.access.token.id;
    }
    warn('login出错:', res);
    throw new scpError(res.data.code, res.data.message);
  }
}

export const Clusters = clusters;
export const Servers = servers;
export const Projects = project;
export default {
  getToken,
  Clusters,
  Servers,
  Projects,
};
