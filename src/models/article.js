module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    title: DataTypes.STRING,
    body: DataTypes.STRING,
    ownerId: DataTypes.INTEGER,
  });
  Article.associate = (models) => {
    Article.belongsTo(models.User, { foreignKey: 'ownerId' });
  };
  return Article;
};
