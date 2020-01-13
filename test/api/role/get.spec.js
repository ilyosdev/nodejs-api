const { app, eachPermission } = require('../../testUtils/app');
const { createRole } = require('../../testUtils/modelFactories');

const apiGet = (roleId) => {
  return app.get(`/role/${roleId}`).send();
};

describe('role - get', () => {
  let roleId;

  beforeAll(async () => {
    roleId = (await createRole()).id;
  });

  it('should not allow unauthenticated users', async () => {
    const res = await apiGet();

    expect(res.status).toBe(401);
  });

  it('should not allow unauthorized users', async () => {
    await app.loginRandom(['role.something']);

    const res = await apiGet(roleId);

    expect(res.status).toBe(403);
  });

  it('should only allow authorized users', async () => {
    const allowedPermissions = [
      'role.view',
      'role.create',
      'role.update',
      'role.delete',
    ];

    await eachPermission(allowedPermissions, async () => {
      const res = await apiGet(roleId);

      expect(res.status).toBe(200);
    });
  });
});
