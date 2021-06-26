const Sequelize = require('sequelize');
const config = new Sequelize("mango", "root", "PASS*word1", {dialect: 'mysql'});

module.exports = config;