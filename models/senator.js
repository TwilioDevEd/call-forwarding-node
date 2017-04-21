module.exports = (sequelize, DataTypes) => {
  const Senator = sequelize.define('Senator', {
    name: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {
    timestamps: false,
    classMethods: {
      associate: (models) => {
        Senator.belongsTo(models.State, {
          onDelete: 'CASCADE',
          foreignKey: { allowNull: true }
        });
      }
    }
  }, {
    name: {
      singular: 'senator',
      plural: 'senators'
    }
  });

  return Senator;
};
