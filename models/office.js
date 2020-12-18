'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Office extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Office.belongsTo(models.Tower, {foreignKey: 'towerId', as: 'tower'})
    }
  };
  Office.init({
    office_number: DataTypes.STRING,
    rent: DataTypes.DOUBLE,
    towerId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Tower',
        key: 'id',
        as: 'towerId',
    }
  }

  }, {
    sequelize,
    modelName: 'Office',
  });


  return Office;
};