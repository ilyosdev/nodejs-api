const { createUser, createArticle } = require('../testUtils/modelFactories');

describe('User model', () => {
  describe('can()', () => {
    it('should evaluate correctly when user is not authorized to perform action', async () => {
      const user = await createUser({}, []);

      expect(await user.can('view', 'article')).toEqual(false);
    });

    it('should evaluate correctly when user is authorized to perform action', async () => {
      const user = await createUser({}, ['role.create']);

      expect(await user.can('create', 'role')).toEqual(true);
    });

    describe('with req argument', () => {
      let user;
      let article;
      const req = { context: {} };

      beforeAll(async () => {
        user = await createUser({}, []);
        article = await createArticle(user);
        req.user = user;
        req.context.article = article;
      });

      it('should evaluate correctly when req is required - authorized', async () => {
        expect(await user.can('update', 'article', req)).toEqual(true);
      });

      it('should evaluate correctly when req is required - unauthorized', async () => {
        req.user = await createUser();

        expect(await user.can('update', 'article', req)).toEqual(false);
      });
    });
  });
});
