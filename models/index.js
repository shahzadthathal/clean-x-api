'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

//Fix the wrong count issue in findAndCountAll()
sequelize.addHook('beforeCount', function (options) {
  if (this._scope.include && this._scope.include.length > 0) {
    options.distinct = true
    options.col = this._scope.col || options.col || `"${this.options.name.singular}".id`
  }
  if (options.include && options.include.length > 0) {
    options.include = null
  }
})

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.users = require("./user.js")(sequelize, Sequelize);
db.towers = require("./tower.js")(sequelize, Sequelize);
db.offices = require("./office.js")(sequelize, Sequelize);

//Define Models Relations
db.towers.hasMany(db.offices, {foreignKey: 'towerId', as: "offices" });
db.offices.belongsTo(db.towers, {as: "tower"});


module.exports = db;
