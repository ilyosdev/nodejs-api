const { app, eachPermission } = require('../../testUtils/app');

const apiList = () => {
  return app.get('/user').send();
};

describe('user - list', () => {
  it('should not allow unauthenticated users', async () => {
    const res = await apiList();

    expect(res.status).toBe(401);
  });

  it('should not allow unauthorized users', async () => {
    await app.loginRandom(['user.something']);

    const res = await apiList();

    expect(res.status).toBe(403);
  });

  it('should only allow authorized users', async () => {
    const allowedPermissions = ['user.*', 'user.view', 'user.setRoles'];

    await eachPermission(allowedPermissions, async (user) => {
      const res = await apiList(user);

      expect(res.status).toBe(200);
    });
  });
});
