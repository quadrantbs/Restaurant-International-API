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

  test("Public Cuisine Without Filter", async () => {
    const response = await request(app)
      .get("/pub/cuisines")
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("Public Cuisine Filter Category Id 1", async () => {
    const response = await request(app)
    .get("/pub/cuisines?filter[categories]=1")
    .set("Authorization", `Bearer ${access_token}`);
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(4);
  });

  test("Public Cuisine Correct Pagination", async () => {
    const response = await request(app)
      .get("/pub/cuisines")
      .set("Authorization", `Bearer ${access_token}`);
  
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(10);
  });

  test("Public One Cuisine", async () => {
    const response = await request(app)
      .get("/pub/cuisines/1")
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data.name).toBe("Sushi");
  });
  test("Public One Cuisine with Id Not Found", async () => {
    const response = await request(app)
      .get("/pub/cuisines/25")
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Cuisine with id 25 is not found");
  });

  test("Public Cuisine Search Name Sushi", async () => {
    const response = await request(app)
    .get("/pub/cuisines?searchKey=sushi")
    .set("Authorization", `Bearer ${access_token}`);
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
  });

  test("Public Cuisine Sort ASC", async () => {
    const response = await request(app)
    .get("/pub/cuisines?sort[by]=id&sort[order]=asc")
    .set("Authorization", `Bearer ${access_token}`);
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].name).toBe('Sushi');
  });
});
