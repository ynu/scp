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