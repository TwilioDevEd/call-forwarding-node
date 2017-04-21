module.exports = (sequelize, DataTypes) => {
  const ZipCode = sequelize.define('ZipCode', {
    zipcode: DataTypes.STRING,
    state: DataTypes.STRING
  }, {
    timestamps: false
  });

  return ZipCode;
};
