/* eslint-disable no-undef */
import process from 'node:process';
import assert from 'assert';
import {Clusters} from '../src/index.js';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const { SCP_HOST, SCP_USERNAME, SCP_PASSWORD } = process.env;

assert.ok(SCP_HOST);
assert.ok(SCP_USERNAME)
assert.ok(SCP_PASSWORD)

// @ts-ignore
describe('集群管理', function() {
  it('查询集群列表', async () => {
    const params = {
      az_id: "",
      type: "",
    }
    const res = await Clusters.list(params,{ SCP_HOST, SCP_USERNAME, SCP_PASSWORD });
    assert.equal(res.code, 0);
  });

  it('获取集群授权', async () => {
    const res = await Clusters.licenses("5a9679f6-4c87-4ea5-84c5-2995b21117883",{ SCP_HOST, SCP_USERNAME, SCP_PASSWORD });
    assert.equal(res.code, 0);
  });

  it('获取加密后的集群密码', async () => {
    const res = await Clusters.password("f213eb2b-70c7-40db-bebb-24efb8d21472",{ SCP_HOST, SCP_USERNAME, SCP_PASSWORD });
    assert.equal(res.code, 0);
  });

  it('查询集群详情', async () => {
    const res = await Clusters.detail("f213eb2b-70c7-40db-bebb-24efb8d21472",{ SCP_HOST, SCP_USERNAME, SCP_PASSWORD });
    assert.equal(res.code, 0);
  });
});