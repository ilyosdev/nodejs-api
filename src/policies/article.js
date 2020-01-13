const isArticleOwner = (req) => {
  return req.user && req.user.id === req.context.article.ownerId;
};

module.exports = {
  view: {
    any: ['article.view', 'article.create', 'article.update', 'article.delete'],
  },
  create: 'article.create',
  update: isArticleOwner,
  delete: { $or: [isArticleOwner, 'article.delete'] },
};
