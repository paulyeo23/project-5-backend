"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("tables", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      maxPlayer: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      blinds: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      timeLimit: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      openClose: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      updatedAt: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        ),
        allowNull: false,
      },
    });
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      accountValue: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      updatedAt: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        ),
        allowNull: false,
      },
    });

    await queryInterface.createTable("transactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      assets: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      liability: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      equity: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      updatedAt: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        ),
        allowNull: false,
      },
    });

    await queryInterface.createTable("tableInfos", {
      roundid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tableid: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "tables",
          key: "id",
        },
      },
      dealerPosition: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      raisePosition: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      currentPosition: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      pot: {
        type: Sequelize.FLOAT,
      },
      currentRaise: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      previousRaise: {
        allowNull: false,
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      gameState: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      nextGame: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      updatedAt: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        ),
        allowNull: false,
      },
    });

    await queryInterface.createTable("decks", {
      roundid: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "tableinfos",
          key: "roundid",
        },
      },
      deck: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      deckPosition: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      updatedAt: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        ),
        allowNull: false,
      },
    });

    await queryInterface.createTable("tablePlayers", {
      handid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      roundid: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "tableinfos",
          key: "roundid",
        },
      },
      userid: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      tablePosition: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      check: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      folded: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      stack: {
        allowNull: false,
        type: Sequelize.FLOAT,
        defaultValue: false,
      },
      called: {
        type: Sequelize.FLOAT,
        defaultValue: false,
      },
      allIn: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      updatedAt: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        ),
        allowNull: false,
      },
    });

    await queryInterface.createTable("communityCards", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      roundid: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "tableinfos",
          key: "roundid",
        },
      },
      card: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: 0,
      },
      createdAt: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      updatedAt: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        ),
        allowNull: false,
      },
    });

    await queryInterface.createTable("playerHands", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      handid: {
        allowNull: false,
        references: {
          model: "tablePlayers",
          key: "handid",
        },
        type: Sequelize.INTEGER,
      },
      card: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      updatedAt: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        ),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("communityCards");
    await queryInterface.dropTable("playerHands");
    await queryInterface.dropTable("tablePlayers");
    await queryInterface.dropTable("decks");
    await queryInterface.dropTable("tableinfos");
    await queryInterface.dropTable("transactions");
    await queryInterface.dropTable("users");
    await queryInterface.dropTable("tables");
  },
};
