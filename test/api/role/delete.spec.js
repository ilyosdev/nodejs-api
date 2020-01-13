const { app, eachPermission } = require('../../testUtils/app');
const { createRole } = require('../../testUtils/modelFactories');

const apiDelete = (roleId) => {
  return app.delete(`/role/${roleId}`).send();
};

describe('role - delete', () => {
  let roleId;

  beforeEach(async () => {
    roleId = (await createRole()).id;
  });

  it('should not allow unauthenticated users', async () => {
    const res = await apiDelete(roleId);

    expect(res.status).toEqual(401);
  });

  it('should not allow unauthorized users', async () => {
    const unauthorizedPermissions = [
      'role.view',
      'role.create',
      'role.update',
      'role.something',
    ];
    await eachPermission(unauthorizedPermissions, async () => {
      const res = await apiDelete(roleId);

      expect(res.status).toEqual(403);
    });
  });

  it('should only allow authorized users', async () => {
    await eachPermission(['role.*', 'role.delete'], async () => {
      roleId = (await createRole()).id; // we need a new role in each run

      const res = await apiDelete(roleId);

      expect(res.status).toEqual(200);
    });
  });
});
