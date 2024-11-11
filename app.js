require("dotenv").config();
const express = require("express");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const CuisineController = require("./controllers/CuisineController");
const CategoryController = require("./controllers/CategoryController");
const PublicCuisineController = require("./controllers/PublicCuisineController");
const UserController = require("./controllers/UserController");
const { authentication } = require("./middlewares/authentication");
const {
  authorizationAdmin,
  authorizationWithAuthor,
} = require("./middlewares/authorization");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/login", UserController.login);
app.get("/pub/cuisines", PublicCuisineController.getCuisines);
app.get("/pub/cuisines/:id", PublicCuisineController.getOneCuisine);

app.use(authentication);

app.post("/add-user", authorizationAdmin, UserController.addUser);

app.post("/cuisines", CuisineController.createCuisines);
app.post("/categories", CategoryController.createCategory);
app.get("/cuisines", CuisineController.getCuisines);
app.get("/categories", CategoryController.getCategory);
app.get("/cuisines/:id", CuisineController.getOneCuisine);
app.put(
  "/categories/:id",
  authorizationAdmin,
  CategoryController.putOneCategory
);
app.put(
  "/cuisines/:id",
  authorizationWithAuthor,
  CuisineController.putOneCuisine
);
app.delete(
  "/cuisines/:id",
  authorizationWithAuthor,
  CuisineController.deleteOneCuisine
);
app.patch(
  "/cuisines/:id/img-url",
  authorizationAdmin,
  upload.single("file"),
  CuisineController.patchCuisineImgUrlById
);

app.use(errorHandler);

module.exports = { app };
