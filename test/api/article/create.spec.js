const { app, eachPermission } = require('../../testUtils/app');

const apiCreate = (data = {}) => {
  return app.post('/article').send(data);
};

describe('article - create', () => {
  it('should not allow unauthenticated users', async () => {
    const res = await apiCreate();

    expect(res.status).toBe(401);
  });

  it('should not allow unauthorized users', async () => {
    const unauthorizedPermissions = [
      'article.view',
      'article.update',
      'article.delete',
      'article.something',
    ];

    await eachPermission(unauthorizedPermissions, async () => {
      const res = await apiCreate();

      expect(res.status).toBe(403);
    });
  });

  it('should only allow authorized users', async () => {
    await eachPermission(['article.*', 'article.create'], async () => {
      const res = await apiCreate({
        title: 'My article',
        body: 'This is me writing.',
      });

      expect(res.status).toBe(200);
    });
  });
});
