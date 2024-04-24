/* eslint-disable no-undef */
import process from 'node:process';
import assert from 'assert';
import {Servers} from '../src/index.js';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const { SCP_HOST, SCP_USERNAME, SCP_PASSWORD } = process.env;

assert.ok(SCP_HOST);
assert.ok(SCP_USERNAME)
assert.ok(SCP_PASSWORD)

// @ts-ignore
describe('云主机管理', function() {
  it('云主机生命周期管理-获取云主机列表信息(20190725)', async () => {
    const params = {
      // az_id: "9653b112-906e-434e-98ba-334b85184072",
      // has_gpu: 1,
      // page_num: 0,
      // page_size: 5,
    }
    const res = await Servers.list(params,{ SCP_HOST, SCP_USERNAME, SCP_PASSWORD });
    assert.equal(res.code, 0);
  });

  it('获取云主机配置信息(20190725)', async () => {
    const res = await Servers.config("f88d775b-c445-452c-8fab-08c7d123db59",{ SCP_HOST, SCP_USERNAME, SCP_PASSWORD });
    assert.equal(res.code, 0);
  });

  // todo 待测试
  it('创建云主机', async () => {
    const params = {

    }
    const res = await Servers.create(params,{ SCP_HOST, SCP_USERNAME, SCP_PASSWORD });
    assert.equal(res.code, 0);
  });
  // todo 待测试
  it('编辑云主机', async () => {
    const params = {

    }
    const res = await Servers.update("server_id", params,{ SCP_HOST, SCP_USERNAME, SCP_PASSWORD });
    assert.equal(res.code, 0);
  });
  // todo 待测试
  it('删除云主机', async () => {
    const params = {
      force: 0,
    }
    const res = await Servers.update("server_id", params,{ SCP_HOST, SCP_USERNAME, SCP_PASSWORD });
    assert.equal(res.code, 0);
  });
  // todo 待测试
  it('启动云主机', async () => {
    const res = await Servers.start("server_id", { SCP_HOST, SCP_USERNAME, SCP_PASSWORD });
    assert.equal(res.code, 0);
  });
  // todo 待测试
  it('关闭云主机', async () => {
    const res = await Servers.stop("server_id", { SCP_HOST, SCP_USERNAME, SCP_PASSWORD });
    assert.equal(res.code, 0);
  });
  // todo 待测试
  it('重启云主机', async () => {
    const res = await Servers.reboot("server_id", { SCP_HOST, SCP_USERNAME, SCP_PASSWORD });
    assert.equal(res.code, 0);
  });
  // todo 待测试
  it('分配云主机(20190725)', async () => {
    const res = await Servers.allocation("server_id", "project_id",{ SCP_HOST, SCP_USERNAME, SCP_PASSWORD });
    assert.equal(res.code, 0);
  });
  // todo 待测试
  it('克隆云主机', async () => {
    const params = {

    }
    const res = await Servers.clone("server_id", params,{ SCP_HOST, SCP_USERNAME, SCP_PASSWORD });
    assert.equal(res.code, 0);
  });
  // todo 待测试
  it('迁移云主机', async () => {
    const params = {

    }
    const res = await Servers.migrate("server_id", params,{ SCP_HOST, SCP_USERNAME, SCP_PASSWORD });
    assert.equal(res.code, 0);
  });
  // todo 待测试
  it('从回收站恢复云主机', async () => {
    const res = await Servers.restore("server_id",{ SCP_HOST, SCP_USERNAME, SCP_PASSWORD });
    assert.equal(res.code, 0);
  });

  it('云主机控制台', async () => {
    const remote_console = {
      protocol: "vnc",
      type: "novnc",
    }
    const res = await Servers.remoteConsoles("2218b978-b780-4b18-8ce2-c50a6290d54c", remote_console,{ SCP_HOST, SCP_USERNAME, SCP_PASSWORD });
    assert.equal(res.code, 0);
  });
  // todo 待测试
  it('云主机批量操作', async () => {
    const server_ids = [
        "server_id1",
        "server_id2",
        "server_id3",
    ]
    const server_action = {
      start_servers_action:"",
    }
    const res = await Servers.action(server_ids, server_action,{ SCP_HOST, SCP_USERNAME, SCP_PASSWORD });
    assert.equal(res.code, 0);
  });

  // todo 待测试
  it('从备份恢复云主机', async () => {
    const params = {
      "recover_type": "create",
      "name": "recover_server_from_server",
      "group_id": "d2252c34-3cec-48a6-b2b2-f259cbdcc686",
      "storage_tag_id": "11111111-1111-1111-1111-111111111111",
      "power_on": 0,
      "location": "cluster"
    }
    const res = await Servers.backupRecover("server_id", "backup_id", params, { SCP_HOST, SCP_USERNAME, SCP_PASSWORD });
    assert.equal(res.code, 0);
  });
});