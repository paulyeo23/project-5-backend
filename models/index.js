const sequelizePackage = require("sequelize");
const allConfig = require("../config/config");

const initUsersModel = require("./users.mjs");
const initDeckModel = require("./deck.mjs");
const initPlayerHandModel = require("./playerHand.mjs");
const initTablePlayerModel = require("./tablePlayer.mjs");
const initTableInfoModel = require("./tableInfo.mjs");
const initTransactionsModel = require("./transactions.mjs");
const initTablesModel = require("./tables.mjs");

const { Sequelize } = sequelizePackage;
const env = "development";
const config = allConfig[env];

const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

db.Users = initUsersModel(sequelize, Sequelize.DataTypes);
db.Deck = initDeckModel(sequelize, Sequelize.DataTypes);
db.PlayerHand = initPlayerHandModel(sequelize, Sequelize.DataTypes);
db.TablePlayer = initTablePlayerModel(sequelize, Sequelize.DataTypes);
db.TableInfo = initTableInfoModel(sequelize, Sequelize.DataTypes);
db.Transactions = initTransactionsModel(sequelize, Sequelize.DataTypes);
db.Tables = initTablesModel(sequelize, Sequelize.DataTypes);

db.Users.belongsToMany(db.Transactions, { through: 'transactions' });
db.Users.belongsToMany(db.TablePlayer, { through: 'tablePlayer' });

db.TablePlayer.belongsToMany(db.PlayerHand, { through: 'playerHand' });

db.TableInfo.belongsToMany(db.PlayerHand, { through: 'playerHand' });
db.TableInfo.belongsToMany(db.TablePlayer, { through: 'tablePlayer' });

db.Tables.belongsToMany(db.TableInfo, { through: 'tableInfo' });

db.Transactions.belongsTo(db.Users);
db.TablePlayer.belongsTo(db.Users);
db.PlayerHand.belongsTo(db.TablePlayer);
db.PlayerHand.belongsTo(db.TableInfo);
db.TablePlayer.belongsTo(db.TableInfo);
db.TableInfo.belongsTo(db.Tables);


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
