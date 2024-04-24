import process from 'node:process';
import crypto from 'crypto'
import forge from 'node-forge'
import axios from "axios";
/**
 * 过滤值为空的参数
 * @param {Object} params 目标对象
 * @returns
 */
export function filterNullParams(params) {
  for (let key in params) {
    if (params[key] === '' || params[key] === null || params[key] === undefined) {
      delete params[key]
    }
  }
  return params;
}

export const detail = async (cluster_id, options = {}) => {
  options.host = options.host || process.env.SCP_HOST;
  const res = await axios.get(`${options.host}/janus/public-key`, {
  })
  return res.data.public_key;
}

/**
 * 加密
 * @param {String} password 密码
 * @param {Object} options 其它参数
 * @returns
 */
export const encryptWithModulus = async (password, options) => {
  options.host = options.host || process.env.SCP_HOST;
  const res = await axios.get(`${options.host}/janus/public-key`, {
  })
  // 获得16进制公钥模数
  const modulusHex = "0x" + res.data.data.public_key
  // 公钥指数
  const publicExponentHex = '0x10001';

  // 将十六进制数转换为BigInt
  const modulus = BigInt(modulusHex, 16);
  const publicExponent = BigInt(publicExponentHex, 16);

  // 创建RSA公钥
  const rsaPublicKey = createRSAPublicKey(modulus, publicExponent);
  const publicKey = forge.pki.publicKeyToPem(rsaPublicKey)

  // 转换为Buffer
  const dataBuffer = Buffer.from(password, 'utf8');

  const publicKeyBuffer = Buffer.from(publicKey.replace(/\\n/gm, '\n'));

  // 创建加密用的RSA key对象
  const key = crypto.createPublicKey({
    key: publicKeyBuffer,
    format: 'pem',
    type: 'spki',
  });

  // 使用RSA加密
  const encryptedData = crypto.publicEncrypt({
    key: key,
    padding: crypto.constants.RSA_PKCS1_PADDING,
  }, dataBuffer);

  // 输出加密后的数据
  // console.log('加密后的数据2:', uint8ArrayToHexString(encryptedData));
  return uint8ArrayToHexString(encryptedData)
}

/**
 * 将8位无符号整型数组转为16进制字符串
 * @param {Array} uint8Array 8位无符号整型数组
 * @returns
 */
function uint8ArrayToHexString(uint8Array) {
  return Array.prototype.map.call(uint8Array, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

/**
 * 创建公钥对象
 * @param {number} modulus 公钥模数
 * @param {number} publicExponent 公钥指数
 * @returns
 */
function createRSAPublicKey(modulus, publicExponent) {
  const publicKey = forge.pki.setRsaPublicKey(modulus, publicExponent);
  return publicKey;
}