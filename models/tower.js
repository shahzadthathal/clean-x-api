'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tower extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //define association here
      /*Tower.hasMany(models.Office, {
          foreignKey: 'towerId',
      })*/
      Tower.hasMany(models.Office, {as: 'offices'})
    }
  };
  Tower.init({
    name: DataTypes.STRING,
    location: DataTypes.STRING,
    number_of_floors: DataTypes.INTEGER,
    number_of_offices: DataTypes.INTEGER,
    rating: DataTypes.DOUBLE,
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'Tower',
  });

  // Tower.associate = models => {
  //   Tower.hasMany(models.offices)
  // }

  return Tower;
};