'use strict';
module.exports = function(sequelize, DataTypes) {
  var ZipCode = sequelize.define('ZipCode', {
    zipcode: DataTypes.STRING,
    state: DataTypes.STRING
  }, {
    timestamps: false,
    classMethods: {
    }
  });
  return ZipCode;
};