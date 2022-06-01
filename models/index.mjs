import { Sequelize } from "sequelize";
import url from "url";
import allConfig from "../config/config.js";

import initUsersModel from "./users.mjs";

import initDeckModel from "./deck.mjs";
import initPlayerHandModel from "./playerHand.mjs";
import initTableInfoModel from "./tableInfo.mjs";
import initTablePlayerModel from "./tablePlayer.mjs";
import initTablesModel from "./tables.mjs";
import initTransactionsModel from "./transactions.mjs";
import initCommunityCardsModel from "./communityCards.mjs";

const env = process.env.NODE_ENV || "development";

const config = allConfig[env];

const db = {};

let sequelize;

if (env === "production") {
  // break apart the Heroku database url and rebuild the configs we need

  const { DATABASE_URL } = process.env;
  const dbUrl = url.parse(DATABASE_URL);
  const username = dbUrl.auth.substr(0, dbUrl.auth.indexOf(":"));
  const password = dbUrl.auth.substr(
    dbUrl.auth.indexOf(":") + 1,
    dbUrl.auth.length,
  );
  const dbName = dbUrl.path.slice(1);

  const host = dbUrl.hostname;
  const { port } = dbUrl;

  config.host = host;
  config.port = port;

  sequelize = new Sequelize(dbName, username, password, config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

db.Users = initUsersModel(sequelize, Sequelize.DataTypes);
db.Deck = initDeckModel(sequelize, Sequelize.DataTypes);
db.PlayerHand = initPlayerHandModel(sequelize, Sequelize.DataTypes);
db.TablePlayer = initTablePlayerModel(sequelize, Sequelize.DataTypes);
db.TableInfo = initTableInfoModel(sequelize, Sequelize.DataTypes);
db.Transactions = initTransactionsModel(sequelize, Sequelize.DataTypes);
db.Tables = initTablesModel(sequelize, Sequelize.DataTypes);
db.CommunityCards = initCommunityCardsModel(sequelize, Sequelize.DataTypes);
db.Deck.removeAttribute("id");

// db.Users.belongsToMany(db.Transactions, { through: 'transactions' });
// db.Users.belongsToMany(db.TablePlayer, { through: 'tablePlayer' });

// db.TablePlayer.belongsToMany(db.PlayerHand, { through: 'playerHand' });

// db.TableInfo.belongsToMany(db.PlayerHand, { through: 'playerHand' });
// db.TableInfo.belongsToMany(db.TablePlayer, { through: 'tablePlayer' });

// db.Tables.belongsToMany(db.TableInfo, { through: 'tableInfo' });

// db.Transactions.belongsTo(db.Users);
// db.TablePlayer.belongsTo(db.Users);
// db.PlayerHand.belongsTo(db.TablePlayer);
// db.PlayerHand.belongsTo(db.TableInfo);
// db.TablePlayer.belongsTo(db.TableInfo);
// db.TableInfo.belongsTo(db.Tables);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
