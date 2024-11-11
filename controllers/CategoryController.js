const { Category } = require("../models");

module.exports = class CategoryController {
  static async getCategory(req, res, next) {
    try {
      const category = await Category.findAll();
      res.status(200).json(category);
    } catch (error) {
      console.log("🚀 ~ CategoryController ~ getCategory ~ error:", error);
      next(error);
    }
  }

  static async createCategory(req, res, next) {
    try {
      const category = await Category.create(req.body);
      res.status(201).json({
        data: category,
        message: `category ${category.name} is created`,
      });
    } catch (error) {
      console.log("🚀 ~ CategoryController ~ createCategory ~ error:", error);
      next(error);
    }
  }

  static async getOneCategory(req, res, next) {
    try {
      const category = await Category.findByPk(parseInt(req.params.id));
      if (!category) {
        next({
          name: "NotFound",
          message: `Category with id ${req.params.id} is not found`,
        });
        return;
      }
      res.json({
        data: category,
        message: `Category ${category.name} is found`,
      });
    } catch (error) {
      console.log("🚀 ~ CategoryController ~ getOneCategory ~ error:", error);
      next(error);
    }
  }

  static async putOneCategory(req, res, next) {
    try {
      const category = await Category.findByPk(parseInt(req.params.id));
      if (!category) {
        next({
          name: "NotFound",
          message: `Category with id ${req.params.id} is not found`,
        });
        return;
      }
      await category.update(req.body);
      res.status(200).json({
        data: category,
        message: `Category ${category.name} is updated`,
      });
    } catch (error) {
      console.log("🚀 ~ CategoryController ~ putOneCategory ~ error:", error);
      next(error);
    }
  }

  // static async deleteOneCuisine(req, res, next) {
  //   try {
  //     const id = parseInt(req.params.id);
  //     const cuisine = await Cuisine.findByPk(id);
  //     if (!cuisine) {
  //       res.status(404).json({ message: `Cuisine with id ${id} is not found` });
  //       return;
  //     }
  //     await cuisine.destroy();
  //     res.json({
  //       message: `Cuisine with id ${id} is deleted`,
  //     });
  //   } catch (error) {
  //     console.log("🚀 ~ CuisineController ~ putOneCuisine ~ error:", error);
  //     res.status(500).json({ message: "ISE" });
  //   }
  // }
};
