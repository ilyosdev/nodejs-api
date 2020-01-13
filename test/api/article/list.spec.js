const { app, eachPermission } = require('../../testUtils/app');

const apiList = () => {
  return app.get('/article').send();
};

describe('article - list', () => {
  it('should not allow unauthenticated users', async () => {
    const res = await apiList();

    expect(res.status).toBe(401);
  });

  it('should not allow unauthorized users', async () => {
    await app.loginRandom(['article.something']);

    const res = await apiList();

    expect(res.status).toBe(403);
  });

  it('should only allow authorized users', async () => {
    const allowedPermissions = [
      'article.view',
      'article.create',
      'article.update',
      'article.delete',
    ];

    await eachPermission(allowedPermissions, async (user) => {
      const res = await apiList(user);

      expect(res.status).toBe(200);
    });
  });
});
