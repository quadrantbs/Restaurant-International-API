"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cuisine extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cuisine.belongsTo(models.Category, {
        foreignKey: "categoryId",
      });
      Cuisine.belongsTo(models.User, {
        foreignKey: "authorId",
      });
    }
  }
  Cuisine.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `name can't be null`,
          },
          notEmpty: {
            msg: `name can't be empty`,
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `description can't be null`,
          },
          notEmpty: {
            msg: `description can't be empty`,
          },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: `price needs to be a number`,
          },
          min: {
            args: [0],
            msg: `price at least 0`,
          },
          notNull: {
            msg: `price can't be null`,
          },
          notEmpty: {
            msg: `price can't be empty`,
          },
        },
      },
      imgUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `imgUrl can't be null`,
          },
          notEmpty: {
            msg: `imgUrl can't be empty`,
          },
          isUrl: {
            msg: `imgUrl needs to be an Url`,
          },
        },
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: `categoryId needs to be a number`,
          },
          notNull: {
            msg: `categoryId can't be null`,
          },
          notEmpty: {
            msg: `categoryId can't be empty`,
          },
        },
      },
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: `authorId needs to be a number`,
          },
          notNull: {
            msg: `authorId can't be null`,
          },
          notEmpty: {
            msg: `authorId can't be empty`,
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Cuisine",
      timestamps: true,
    }
  );
  return Cuisine;
};
