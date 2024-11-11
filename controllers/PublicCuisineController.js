const { Op } = require("sequelize");
const { Cuisine, User } = require("../models");

module.exports = class CuisineController {
  static async getCuisines(req, res, next) {
    const { filter, sort, page, searchKey } = req.query;
    const paramQuery = {
      include: {
        model: User,
        attributes: {
          exclude: ["password"],
        },
      },
      where: {},
      limit: 10,
      offset: 0,
    };
    if (filter && filter.categories) {
      paramQuery.where.categoryId = filter.categories.split(",");
    }
    if (page) {
      if (page.size) {
        paramQuery.limit = page.size;
      }

      if (page.number) {
        paramQuery.offset = page.number * paramQuery.limit - paramQuery.limit;
      }
    }
    if (sort) {
      paramQuery.order = [[sort.by, sort.order]];
    }
    if (searchKey) {
      paramQuery.where.name = {
        [Op.iLike]: `%${searchKey}%`,
      };
    }
    try {
      const cuisines = await Cuisine.findAll(paramQuery);
      res.status(200).json(cuisines);
    } catch (error) {
      console.log("🚀 ~ CuisineController ~ getCuisines ~ error:", error);
      next(error);
    }
  }

  static async getOneCuisine(req, res, next) {
    try {
      const cuisine = await Cuisine.findOne({
        include: {
          model: User,
          attributes: {
            exclude: ["password"],
          },
        },
        where: { id: parseInt(req.params.id) },
      });
      if (!cuisine) {
        res
          .status(404)
          .json({ message: `Cuisine with id ${req.params.id} is not found` });
        return;
      }
      res.status(200).json({
        data: cuisine,
        message: `Cuisine ${cuisine.name} is found`,
      });
    } catch (error) {
      console.log("🚀 ~ CuisineController ~ getOneCuisine ~ error:", error);
      next(error);
    }
  }
};
