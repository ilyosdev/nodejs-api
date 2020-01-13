const faker = require('faker');
const { User, Role, Article } = require('../../src/models');

const createRole = async (permissions = []) => {
  return Role.create({
    name: faker.name.jobTitle(),
    permissions,
  });
};

const createUser = async (overrides = {}, permissions = []) => {
  const user = await User.create({
    name: faker.fake('{{name.firstName}} {{name.lastName}}'),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
    ...overrides,
  });
  if (permissions.length) {
    const role = await createRole(permissions);
    await user.setRoles([role.id]);
  }
  return user;
};

const createArticle = async (owner, overrides = {}) => {
  const articleOwner = owner || (await createUser());
  return Article.create({
    ownerId: articleOwner.id,
    title: faker.lorem.sentence(1),
    body: faker.lorem.sentence(1),
    ...overrides,
  });
};

module.exports = {
  createRole,
  createUser,
  createArticle,
};
