/* eslint-disable no-undef */
import process from 'node:process';
import assert from 'assert';
import {Projects} from '../src/index.js';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const { SCP_HOST, SCP_USERNAME, SCP_PASSWORD } = process.env;

assert.ok(SCP_HOST);
assert.ok(SCP_USERNAME)
assert.ok(SCP_PASSWORD)

// @ts-ignore
describe('租户管理', function() {
  it('获取租户列表', async () => {
    const params = {
      keywords: "学院",
    }
    const res = await Projects.list(params,{ SCP_HOST, SCP_USERNAME, SCP_PASSWORD });
    assert.equal(res.code, 0);
  });

  it('获取租户详情', async () => {
    const res = await Projects.detail("02c4d814796e4d5aa18a1810656c08c0",{ SCP_HOST, SCP_USERNAME, SCP_PASSWORD });
    assert.equal(res.code, 0);
  });

  it('创建租户', async () => {
    const project = {
      "id": "8e9fbbc04d7b40f6bc3bbe549fd1655b",
      "name": "tenant",
      "description": "",
      "project_admin": {
        "user_name": "yy_admin",
        "mail": "aaa@123.com",
        "phone": "13412345678",
        "password": ""
      }
    }
    const res = await Projects.create(project,{ SCP_HOST, SCP_USERNAME, SCP_PASSWORD });
    assert.equal(res.code, 0);
  });

  it('编辑租户', async () => {
    const project = {
      "name": "yy测试"
    }
    const res = await Projects.update("8e9fbbc04d7b40f6bc3bbe549fd1655b", project,{ SCP_HOST, SCP_USERNAME, SCP_PASSWORD });
    assert.equal(res.code, 0);
  });

  it('删除租户', async () => {
    const res = await Projects.remove("8e9fbbc04d7b40f6bc3bbe549fd1655b",{ SCP_HOST, SCP_USERNAME, SCP_PASSWORD });
    assert.equal(res.status, 204);
  });

  it('租户关联资源池', async () => {
    const azs = [
      {
        "az_id": "aa44e975-36f5-4894-80be-11ddfecf7098",
      }
    ]
    const res = await Projects.azs("8e9fbbc04d7b40f6bc3bbe549fd1655b",azs,{ SCP_HOST, SCP_USERNAME, SCP_PASSWORD });
    assert.equal(res.code, 0);
  });

  it('租户解除关联资源池', async () => {
    const res = await Projects.azsCancel("8e9fbbc04d7b40f6bc3bbe549fd1655b","aa44e975-36f5-4894-80be-11ddfecf7098",{ SCP_HOST, SCP_USERNAME, SCP_PASSWORD });
    assert.equal(res.code, 0);
  });
});