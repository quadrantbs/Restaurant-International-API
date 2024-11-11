const {
  test,
  expect,
  beforeAll,
  afterAll,
  describe,
} = require("@jest/globals");
const request = require("supertest");
const { app } = require("../app");
const { User, Cuisine, Category, sequelize } = require("../models");
const { signToken } = require("../helpers/jwt");
const fs = require("fs");
const { hashPassword } = require("../helpers/bcrypt");

let access_token;
let access_token_staff;

describe("Cuisine CRUD Tests", () => {
  beforeAll(async () => {
    await User.create({
      email: "admin1@example.com",
      password: "securepassword",
      role: "Admin",
    });
    const user = await User.findOne({
      where: {
        email: "admin1@example.com",
      },
    });
    access_token = signToken({ id: user.id });
    await User.create({
      email: "staff1@example.com",
      password: "securepassword",
      role: "Staff",
    });
    const userStaff = await User.findOne({
      where: {
        email: "staff1@example.com",
      },
    });
    access_token_staff = signToken({ id: userStaff.id });

    const categories = JSON.parse(
      fs.readFileSync("./data/categories.json", "utf-8")
    ).map((e) => {
      e.createdAt = e.updatedAt = new Date();
      return e;
    });
    const cuisines = JSON.parse(
      fs.readFileSync("./data/cuisines.json", "utf-8")
    ).map((e) => {
      e.createdAt = e.updatedAt = new Date();
      return e;
    });
    await sequelize.queryInterface.bulkInsert("Categories", categories, {});
    await sequelize.queryInterface.bulkInsert("Cuisines", cuisines, {});
  });

  afterAll(async () => {
    await User.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
    await Cuisine.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
    await Category.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  });

  test("Create Cuisine", async () => {
    const response = await request(app)
      .post("/cuisines")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        name: "Sushi",
        description:
          "Hidangan tradisional Jepang dengan nasi yang diberi cuka, seafood, dan sayuran.",
        price: 150000,
        imgUrl: "https://example.com/sushi.jpg",
        categoryId: 1,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Cuisine Sushi is created");
  });

  test("Create Cuisine Without Token", async () => {
    const response = await request(app).post("/cuisines").send({
      name: "Sushi",
      description:
        "Hidangan tradisional Jepang dengan nasi yang diberi cuka, seafood, dan sayuran.",
      price: 150000,
      imgUrl: "https://example.com/sushi.jpg",
      categoryId: 1,
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Invalid token");
  });

  test("Create Cuisine With Wrong Token", async () => {
    const response = await request(app)
      .post("/cuisines")
      .set("Authorization", `Bearer a`)
      .send({
        name: "Sushi",
        description:
          "Hidangan tradisional Jepang dengan nasi yang diberi cuka, seafood, dan sayuran.",
        price: 150000,
        imgUrl: "https://example.com/sushi.jpg",
        categoryId: 1,
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Invalid token");
  });

  test("Create Cuisine With Validation Error", async () => {
    const response = await request(app)
      .post("/cuisines")
      .set("Authorization", `Bearer ${access_token}`)
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body.message[0]).toBe("name can't be null");
    expect(response.body.message[1]).toBe("description can't be null");
    expect(response.body.message[2]).toBe("price can't be null");
    expect(response.body.message[3]).toBe("imgUrl can't be null");
    expect(response.body.message[4]).toBe("categoryId can't be null");
  });

  test("Update Cuisine Based on Id", async () => {
    const response = await request(app)
      .put("/cuisines/1")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        name: "Sushi",
        description:
          "Hidangan tradisional Jepang dengan nasi yang diberi cuka, seafood, dan sayuran.",
        price: 150000,
        imgUrl: "https://example.com/sushi.jpg",
        categoryId: 1,
      });
    expect(response.statusCode).toBe(200);
  });

  test("Update Cuisine Without Token", async () => {
    const response = await request(app).post("/cuisines/1").send({
      name: "Sushi",
      description:
        "Hidangan tradisional Jepang dengan nasi yang diberi cuka, seafood, dan sayuran.",
      price: 150000,
      imgUrl: "https://example.com/sushi.jpg",
      categoryId: 1,
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Invalid token");
  });

  test("Update Cuisine With Wrong Token", async () => {
    const response = await request(app)
      .post("/cuisines/1")
      .set("Authorization", `Bearer a`)
      .send({
        name: "Sushi",
        description:
          "Hidangan tradisional Jepang dengan nasi yang diberi cuka, seafood, dan sayuran.",
        price: 150000,
        imgUrl: "https://example.com/sushi.jpg",
        categoryId: 1,
        authorId: 1,
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Invalid token");
  });

  test("Update Cuisine Based on Invalid Id", async () => {
    const cuisine = {
      name: "Sushi",
      description:
        "Hidangan tradisional Jepang dengan nasi yang diberi cuka, seafood, dan sayuran.",
      price: 150000,
      imgUrl: "https://example.com/sushi.jpg",
      categoryId: 1,
      authorId: 1,
    };
    const response = await request(app)
      .put("/cuisines/22")
      .set("Authorization", `Bearer ${access_token}`)
      .send(cuisine);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Cuisine with id 22 is not found");
  });

  test("Update Cuisine Based on Id By Wrong User", async () => {
    const response = await request(app)
      .put("/cuisines/1")
      .set("Authorization", `Bearer ${access_token_staff}`)
      .send({
        name: "Sushi",
        description:
          "Hidangan tradisional Jepang dengan nasi yang diberi cuka, seafood, dan sayuran.",
        price: 150000,
        imgUrl: "https://example.com/sushi.jpg",
        categoryId: 1,
        authorId: 1,
      });
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe("You are not authorized");
  });

  test("Update Cuisine Based on Id Invalid Request Body", async () => {
    const response = await request(app)
      .put("/cuisines/1")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        name: "",
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.message[0]).toBe("name can't be empty");
  });

  test("Delete Cuisine Based on Id", async () => {
    const response = await request(app)
      .delete("/cuisines/1")
      .set("Authorization", `Bearer ${access_token}`)
      
    expect(response.statusCode).toBe(200);
  });

  test("Delete Cuisine Without Token", async () => {
    const response = await request(app).delete("/cuisines/1")

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Invalid token");
  });

  test("Delete Cuisine With Wrong Token", async () => {
    const response = await request(app)
      .delete("/cuisines/1")
      .set("Authorization", `Bearer a`)
      
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Invalid token");
  });

  test("Delete Cuisine Based on Invalid Id", async () => {
    const response = await request(app)
      .delete("/cuisines/22")
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Cuisine with id 22 is not found");
  });

  test("Delete Cuisine Based on Id By Wrong User", async () => {
    const response = await request(app)
      .delete("/cuisines/2")
      .set("Authorization", `Bearer ${access_token_staff}`);
      
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe("You are not authorized");
  });
});
