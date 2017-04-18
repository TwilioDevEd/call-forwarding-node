'use strict';
module.exports = function(sequelize, DataTypes) {
  var State = sequelize.define('State', {
    name: DataTypes.STRING
  }, {
    timestamps: false,
    classMethods: {
      associate: function(models) {
        State.hasMany(models.Senator);
      }
    }
  });
  return State;
};