const { User } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");

module.exports = class UserController {
  static async addUser(req, res, next) {
    const { email, password } = req.body;
    try {
      const user = await User.create({ email, password });
      res.status(201).json({
        id: user.id,
        email: user.email,
      });
    } catch (error) {
      next(error);
    }
  }
  static async login(req, res, next) {
    const { email, password } = req.body;
    if (!email) {
      next({ name: "BadRequest", message: "Email is required" });
      return;
    }
    if (!password) {
      next({ name: "BadRequest", message: "Password is required" });
      return;
    }
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        next({ name: "Unauthorized", message: "Invalid email or password" });
        return;
      }
      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        next({ name: "Unauthorized", message: "Invalid email or password" });
        return;
      }
      const access_token = signToken({ id: user.id });
      res.status(200).json({ access_token });
    } catch (error) {
      next(error);
    }
  }
};
