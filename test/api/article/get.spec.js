const { app, eachPermission } = require('../../testUtils/app');
const { createArticle } = require('../../testUtils/modelFactories');

const apiGet = (articleId) => {
  return app.get(`/article/${articleId}`).send();
};

describe('article - get', () => {
  let articleId;

  beforeAll(async () => {
    articleId = (await createArticle()).id;
  });

  it('should not allow unauthenticated users', async () => {
    const res = await apiGet();

    expect(res.status).toBe(401);
  });

  it('should not allow unauthorized users', async () => {
    await app.loginRandom(['article.something']);

    const res = await apiGet(articleId);

    expect(res.status).toBe(403);
  });

  it('should only allow authorized users', async () => {
    const allowedPermissions = [
      'article.view',
      'article.create',
      'article.update',
      'article.delete',
    ];

    await eachPermission(allowedPermissions, async () => {
      const res = await apiGet(articleId);

      expect(res.status).toBe(200);
    });
  });
});
