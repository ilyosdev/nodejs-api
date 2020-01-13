const { Article } = require('../models');

module.exports = {
  list: async (req, res) => {
    const articles = await Article.findAll();
    return res.json({ articles });
  },

  get: async (req, res) => {
    return res.json({ article: req.context.article.toJSON() });
  },

  create: async (req, res) => {
    const article = await Article.create({
      ownerId: req.user.id,
      ...req.body,
    });
    return res.json({ article, message: 'Article created successfully.' });
  },

  update: async (req, res) => {
    const article = await req.context.article.update({ ...req.body });
    return res.json({ article, message: 'Article updated successfully.' });
  },

  delete: async (req, res) => {
    await req.context.article.destroy();
    return res.json({ message: 'Article deleted successfully.' });
  },
};
