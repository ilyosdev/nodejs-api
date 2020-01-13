const { app, eachPermission } = require('../../testUtils/app');
const { createUser, createArticle } = require('../../testUtils/modelFactories');

const apiUpdate = (articleId) => {
  return app.put(`/article/${articleId}`).send();
};

describe('update', () => {
  let owner;
  let articleId;

  beforeAll(async () => {
    owner = await createUser();
    articleId = (await createArticle(owner)).id;
  });

  it('should not allow unauthenticated users', async () => {
    const res = await apiUpdate();

    expect(res.status).toEqual(401);
  });

  it('should not allow unauthorized users', async () => {
    await eachPermission(['article.*', 'article.something'], async () => {
      const res = await apiUpdate(articleId);

      expect(res.status).toEqual(403);
    });
  });

  it('should only allow authorized users', async () => {
    await app.login(owner);

    const res = await apiUpdate(articleId, {
      title: 'My updated article',
      body: "It's updated. Right?",
    });

    expect(res.status).toEqual(200);
  });
});
