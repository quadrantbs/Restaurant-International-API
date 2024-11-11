const { Cuisine } = require("../models");

async function authorizationAdmin(req, res, next) {
  try {
    console.log("🚀 ~ authorizationAdmin ~ req:", req.params);
    console.log("User is", req.user.role);
    if (req.user.role !== "Admin") {
      next({ name: "Forbidden", message: "You are not authorized" });
      return;
    }
    next();
  } catch (error) {
    console.log("🚀 ~ authorizationAdmin ~ error:", error);
    next(error);
  }
}

async function authorizationWithAuthor(req, res, next) {
  try {
    console.log("🚀 ~ authorizationAuthor ~ req:", req.params);
    const cuisine = await Cuisine.findByPk(req.params.id);
    if (!cuisine) {
      next({
        name: "NotFound",
        message: `Cuisine with id ${req.params.id} is not found`,
      });
      return;
    }
    console.log("User Id ", req.user.id, ", author Id ", cuisine.authorId);
    console.log("User is", req.user.role);
    if (req.user.role !== "Admin" && req.user.id !== cuisine.authorId) {
      next({ name: "Forbidden", message: "You are not authorized" });
      return;
    }
    next();
  } catch (error) {
    console.log("🚀 ~ authorizationWithAuthor ~ error:", error);
    next(error);
  }
}

module.exports = { authorizationAdmin, authorizationWithAuthor };
