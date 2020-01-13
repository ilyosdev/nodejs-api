const supertest = require('supertest');

const appDef = require('../../src');
const { generateAuthToken } = require('../../src/utils');
const { createRole, createUser } = require('./modelFactories');

const app = {
  token: null,

  /**
   * Login a user by passing an existing user object. Also, specify the user
   * permissions. Behind the scenes it creates a group with the permissions
   * and attaches the user to it.
   *
   * @param user
   * @param permissions
   * @returns {Promise<void>}
   */
  async login(user, permissions = []) {
    const role = await createRole(permissions);
    await user.setRoles([role]);
    this.token = await generateAuthToken(user);
  },

  /**
   * Login a randomly generated user that has the permissions provided. Behind
   * the scenes it creates a group with the permissions and attaches the
   * user to it.
   *
   * @param permissions
   * @returns {Promise<void>}
   */
  async loginRandom(permissions = []) {
    const role = await createRole(permissions);
    const user = await createUser();
    await user.setRoles([role.id]);
    this.token = await generateAuthToken(user);
    return user;
  },

  /**
   * Call this method to logout the currently logged in user.
   */
  async logout() {
    this.token = null;
  },

  req: supertest(appDef),

  /**
   * Add authorization header to the specified supertest request object.
   * @param request
   * @returns {*}
   */
  addAuthorization(request) {
    return this.token ? request.set('authorization', `${this.token}`) : request;
  },

  /**
   * Make a get request with the authorization header (token) set if a user is
   * logged in.
   *
   * @param url
   * @returns {*}
   */
  get(url) {
    const request = this.req.get(url);

    return this.addAuthorization(request);
  },

  /**
   * Make a post request with the authorization header (token) set if a user is
   * logged in.
   *
   * @param url
   * @returns {*}
   */
  post(url) {
    const request = this.req.post(url);

    return this.addAuthorization(request);
  },

  /**
   * Make a put request with the authorization header (token) set if a user is
   * logged in.
   *
   * @param url
   * @returns {*}
   */
  put(url) {
    const request = this.req.put(url);

    return this.addAuthorization(request);
  },

  /**
   * Make a delete request with the authorization header (token) set if a user is
   * logged in.
   *
   * @param url
   * @returns {*}
   */
  delete(url) {
    const request = this.req.delete(url);

    return this.addAuthorization(request);
  },
};

/**
 * Run a supertest test block separately for
 * each of the users.
 *
 * @param permissions
 * @param testBlock
 */
const eachPermission = async (permissions, testBlock) => {
  app.logout();

  for (let i = 0; i < permissions.length; i += 1) {
    // eslint-disable-next-line
    await app.login(await createUser({}), [permissions[i]]);
    // eslint-disable-next-line
    await testBlock();
  }
};

module.exports = {
  app,
  eachPermission,
};
