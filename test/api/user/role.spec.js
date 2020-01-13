const { app, eachPermission } = require('../../testUtils/app');
const { createUser, createRole } = require('../../testUtils/modelFactories');

const apiUpdate = (userId, data) => {
  return app.put(`/user/${userId}/role`).send(data);
};

describe('user - role', () => {
  let userId;

  beforeEach(async () => {
    userId = (await createUser()).id;
  });

  it('should not allow unauthenticated users', async () => {
    const res = await apiUpdate(userId);

    expect(res.status).toEqual(401);
  });

  it('should not allow unauthorized users', async () => {
    const unauthorizedPermissions = ['user.view', 'user.something'];

    await eachPermission(unauthorizedPermissions, async () => {
      const res = await apiUpdate(userId);

      expect(res.status).toEqual(403);
    });
  });

  it('should reject data with invalid system roles', async () => {
    await app.loginRandom(['user.setRoles']);

    const res = await apiUpdate(userId, {
      roleIds: [9999999999, 9999999999],
    });

    expect(res.status).toBe(400);
  });

  it('should only allow authorized users', async () => {
    const existingRole1 = await createRole();
    const existingRole2 = await createRole();

    await eachPermission(['user.*', 'user.setRoles'], async () => {
      const res = await apiUpdate(userId, {
        roleIds: [existingRole1.id, existingRole2.id],
      });

      expect(res.status).toBe(200);
    });
  });
});
