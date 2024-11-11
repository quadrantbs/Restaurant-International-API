const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

async function authentication(req, res, next) {
  console.log("authentication");
  const bearerToken = req.headers.authorization;
  if (!bearerToken) {
    console.log(bearerToken);
    next({ name: "Unauthorized", message: "Invalid token" });
    return;
  }
  const [, token] = bearerToken.split(" ");
  if (!token) {
    next({ name: "Unauthorized", message: "Invalid token" });
    return;
  }
  try {
    const data = verifyToken(token);
    const user = await User.findByPk(data.id);
    if (!user) {
      next({ name: "Unauthorized", message: "Invalid token" });
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("🚀 ~ authentication ~ error:", error);
    next(error);
  }
}

module.exports = { authentication };
