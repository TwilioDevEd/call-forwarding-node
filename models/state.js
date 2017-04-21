module.exports = (sequelize, DataTypes) => {
  const State = sequelize.define('State', {
    name: DataTypes.STRING
  }, {
    timestamps: false,
    classMethods: {
      associate: (models) => {
        State.hasMany(models.Senator);
      }
    }
  });

  return State;
};
