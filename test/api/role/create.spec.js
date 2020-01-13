const { app, eachPermission } = require('../../testUtils/app');

const apiCreate = (data = {}) => {
  return app.post('/role').send(data);
};

describe('role - create', () => {
  it('should not allow unauthenticated users', async () => {
    const res = await apiCreate();

    expect(res.status).toBe(401);
  });

  it('should not allow unauthorized users', async () => {
    const unauthorizedPermissions = [
      'role.view',
      'role.update',
      'role.delete',
      'role.something',
    ];
    await eachPermission(unauthorizedPermissions, async () => {
      const res = await apiCreate();

      expect(res.status).toBe(403);
    });
  });

  it('should reject data with invalid system permissions', async () => {
    await app.loginRandom(['role.create']);

    const res = await apiCreate({
      name: 'My role',
      permissions: ['something.create'],
    });

    expect(res.status).toBe(400);
    expect(res.body.invalids).toEqual(['something.create']);
  });

  it('should only allow authorized users', async () => {
    await eachPermission(['role.*', 'role.create'], async () => {
      const res = await apiCreate({
        name: 'My role',
        permissions: ['article.create', 'article.delete'],
      });

      expect(res.status).toBe(200);
    });
  });
});
