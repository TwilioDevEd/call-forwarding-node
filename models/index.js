const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const db = {};
const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'development';
const config = require('./../config/config.json')[env];

const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable])
  : new Sequelize([config.database, config.username, config.password, config]);

const isJsFile = file => (file.indexOf('.') !== 0) &&
                         (file !== basename) &&
                         (file.slice(-3) === '.js');

fs.readdirSync(__dirname)
  .filter(isJsFile)
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
