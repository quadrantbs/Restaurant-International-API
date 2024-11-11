const {
  test,
  expect,
  beforeAll,
  afterAll,
  describe,
} = require("@jest/globals");
const request = require("supertest");
const { app } = require("../app");
const { User, sequelize } = require("../models");
const { signToken } = require("../helpers/jwt");


let access_token;

describe("Admin Login Tests", () => {
  beforeAll(async () => {
    await User.create({
      email: "admin@example.com",
      password: "securepassword",
      role: "Admin",
    });
    const user = await User.findOne({
      where: {
        email: "admin@example.com",
      },
    });
    access_token = signToken({ id: user.id });
  });

  afterAll(async () => {
    await User.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  });

  test("Login and Get access_token", async () => {
    const response = await request(app).post("/login").send({
      email: "admin@example.com",
      password: "securepassword",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("access_token", access_token);
  });

  test("Email undefined", async () => {
    const response = await request(app).post("/login").send({
      password: "securepassword",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message", "Email is required");
  });

  test("Password undefined", async () => {
    const response = await request(app).post("/login").send({
      email: "admin@example.com",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message", "Password is required");
  });

  test("Email not found", async () => {
    const response = await request(app).post("/login").send({
      email: "invalid@example.com",
      password: "securepassword",
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Invalid email or password"
    );
  });

  test("Password not match", async () => {
    const response = await request(app).post("/login").send({
      email: "admin@example.com",
      password: "wrongpassword",
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Invalid email or password"
    );
  });
});
