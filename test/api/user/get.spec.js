const { app, eachPermission } = require('../../testUtils/app');
const { createUser } = require('../../testUtils/modelFactories');

const apiGet = (userId) => {
  return app.get(`/user/${userId}`).send();
};

describe('user - get', () => {
  let userId;

  beforeAll(async () => {
    userId = (await createUser()).id;
  });

  it('should not allow unauthenticated users', async () => {
    const res = await apiGet();

    expect(res.status).toBe(401);
  });

  it('should not allow unauthorized users', async () => {
    await app.loginRandom(['user.something']);

    const res = await apiGet(userId);

    expect(res.status).toBe(403);
  });

  it('should only allow authorized users', async () => {
    const allowedPermissions = ['user.*', 'user.view', 'user.setRoles'];

    await eachPermission(allowedPermissions, async () => {
      const res = await apiGet(userId);

      expect(res.status).toBe(200);
    });
  });
});
