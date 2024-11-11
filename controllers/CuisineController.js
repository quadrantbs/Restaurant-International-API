const { Cuisine, User } = require("../models");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
module.exports = class CuisineController {
  static async getCuisines(req, res, next) {
    try {
      const cuisines = await Cuisine.findAll({
        include: {
          model: User,
          attributes: {
            exclude: ["password"],
          },
        },
      });
      res.status(200).json(cuisines);
    } catch (error) {
      console.log("🚀 ~ CuisineController ~ getCuisines ~ error:", error);
      next(error);
    }
  }

  static async createCuisines(req, res, next) {
    try {
      const cuisineData = req.body;
      cuisineData.authorId = req.user.id;
      const cuisine = await Cuisine.create(cuisineData);
      res.status(201).json({
        data: cuisine,
        message: `Cuisine ${cuisineData.name} is created`,
      });
    } catch (error) {
      console.log("🚀 ~ CuisineController ~ createCuisines ~ error:", error);
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
        next({
          name: "NotFound",
          message: `Cuisine with id ${req.params.id} is not found`,
        });
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

  static async putOneCuisine(req, res, next) {
    try {
      const idCuisine = req.params.id;
      const cuisineData = req.body;
      cuisineData.authorId = req.user.id;
      const cuisine = await Cuisine.findByPk(idCuisine);
      if (!cuisine) {
        next({
          name: "NotFound",
          message: `Cuisine with id ${idCuisine} is not found`,
        });
        return;
      }
      await cuisine.update(cuisineData);
      res.status(200).json({
        data: cuisine,
        message: `Cuisine ${cuisine.name} is updated`,
      });
    } catch (error) {
      console.log("🚀 ~ CuisineController ~ putOneCuisine ~ error:", error);
      next(error);
    }
  }

  static async deleteOneCuisine(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const cuisine = await Cuisine.findByPk(id);
      const name = cuisine.name;
      if (!cuisine) {
        next({
          name: "NotFound",
          message: `Cuisine with id ${id} is not found`,
        });
        return;
      }
      await cuisine.destroy();
      res.status(200).json({
        message: `Cuisine ${name} is deleted`,
      });
    } catch (error) {
      console.log("🚀 ~ CuisineController ~ putOneCuisine ~ error:", error);
      next(error);
    }
  }

  static async patchCuisineImgUrlById(req, res, next) {
    try {
      const cuisineId = +req.params.id;
      const cuisine = await Cuisine.findByPk(cuisineId);
      if (!cuisine) {
        next({ name: "NotFound", message: "Cuisine not found" });
      }
      const mimeType = req.file.mimetype;
      const base64image = req.file.buffer.toString("base64");

      const result = await cloudinary.uploader.upload(
        `data:${mimeType};base64,${base64image}`,
        {
          folder: "RestaurantInternational",
          public_id: req.file.originalname,
        }
      );
      await cuisine.update({ imgUrl: result.secure_url });
      res.json({
        message: `imgUrl of ${cuisine.name} has been updated`,
      });
    } catch (error) {
      console.log(
        "🚀 ~ CuisineController ~ authorizationAdmin ~ error:",
        error
      );
      next(error);
    }
  }
};
