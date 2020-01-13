const { app, eachPermission } = require('../testUtils/app');

const apiList = () => {
  return app.get('/permission').send();
};

describe('permission - list', () => {
  it('should not allow unauthenticated users', async () => {
    const res = await apiList();

    expect(res.status).toBe(401);
  });

  it('should not allow unauthorized users', async () => {
    await app.loginRandom(['role.something']);

    const res = await apiList();

    expect(res.status).toBe(403);
  });

  it('should only allow authorized users', async () => {
    const allowedPermissions = [
      'role.view',
      'role.create',
      'role.update',
      'role.delete',
    ];

    await eachPermission(allowedPermissions, async (user) => {
      const res = await apiList(user);

      expect(res.status).toBe(200);
    });
  });
});
