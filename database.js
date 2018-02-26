const config = require('./config.json').development;
const Sequelize = require('sequelize');

const db = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect
});

db.query('CREATE DATABASE IF NOT EXISTS massdrop').then(() => {
  console.log('Created new database massdrop');
}).catch((error) => {
  console.log('Failed to create new database: ', error);
});

const URLCache = db.define('urlcaches', {
  queueId: Sequelize.INTEGER,
  url: Sequelize.STRING,
  html: Sequelize.TEXT
});

URLCache.sync();

module.exports.URLCache = URLCache;