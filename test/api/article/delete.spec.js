const { app, eachPermission } = require('../../testUtils/app');
const { createUser, createArticle } = require('../../testUtils/modelFactories');

const apiDelete = (articleId) => {
  return app.delete(`/article/${articleId}`).send();
};

describe('article - delete', () => {
  let owner;
  let articleId;

  beforeEach(async () => {
    owner = await createUser();
    articleId = (await createArticle(owner)).id;
  });

  it('should not allow unauthenticated users', async () => {
    const res = await apiDelete(articleId);

    expect(res.status).toEqual(401);
  });

  it('should not allow unauthorized users', async () => {
    const unauthorizedPermissions = [
      'article.view',
      'article.create',
      'article.update',
      'article.something',
    ];

    await eachPermission(unauthorizedPermissions, async () => {
      const res = await apiDelete(articleId);

      expect(res.status).toEqual(403);
    });
  });

  it('should allow owner', async () => {
    // owner
    await app.login(owner);

    const res = await apiDelete(articleId);

    expect(res.status).toEqual(200);
  });

  it('should allow permitted user', async () => {
    // this could be admin
    await app.loginRandom(['article.delete']);

    const res = await apiDelete(articleId);

    expect(res.status).toEqual(200);
  });
});
