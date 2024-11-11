"use strict";
const fs = require("fs");
const { hashPassword } = require("../helpers/bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const categories = JSON.parse(
      fs.readFileSync("./data/categories.json", "utf-8")
    ).map((e) => {
      e.createdAt = e.updatedAt = new Date();
      return e;
    });

    const users = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
    const hashedUsersPass = await Promise.all(
      users.map(async (e) => {
        e.createdAt = e.updatedAt = new Date();
        e.password = await hashPassword(e.password);
        return e;
      })
    );

    const cuisines = JSON.parse(
      fs.readFileSync("./data/cuisines.json", "utf-8")
    ).map((e) => {
      e.createdAt = e.updatedAt = new Date();
      return e;
    });

    await queryInterface.bulkInsert("Categories", categories, {});
    await queryInterface.bulkInsert("Users", hashedUsersPass, {});
    await queryInterface.bulkInsert("Cuisines", cuisines, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Cuisines", null, {});
    await queryInterface.bulkDelete("Categories", null, {});
    await queryInterface.bulkDelete("Users", null, {});
  },
};
