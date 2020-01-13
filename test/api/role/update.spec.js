const { app, eachPermission } = require('../../testUtils/app');
const { createRole } = require('../../testUtils/modelFactories');

const apiUpdate = (roleId, data) => {
  return app.put(`/role/${roleId}`).send(data);
};

describe('role - delete', () => {
  let roleId;

  beforeEach(async () => {
    roleId = (await createRole()).id;
  });

  it('should not allow unauthenticated users', async () => {
    const res = await apiUpdate(roleId);

    expect(res.status).toEqual(401);
  });

  it('should not allow unauthorized users', async () => {
    const unauthorizedPermissions = [
      'role.view',
      'role.create',
      'role.delete',
      'role.something',
    ];
    await eachPermission(unauthorizedPermissions, async () => {
      const res = await apiUpdate(roleId);

      expect(res.status).toEqual(403);
    });
  });

  it('should reject data with invalid system permissions', async () => {
    await app.loginRandom(['role.update']);

    const res = await apiUpdate(roleId, {
      name: 'My role',
      permissions: ['something.create'],
    });

    expect(res.status).toBe(400);
    expect(res.body.invalids).toEqual(['something.create']);
  });

  it('should only allow authorized users', async () => {
    await eachPermission(['role.*', 'role.update'], async () => {
      const res = await apiUpdate(roleId, {
        name: 'My role',
        permissions: ['article.create', 'article.delete'],
      });

      expect(res.status).toBe(200);
    });
  });
});
