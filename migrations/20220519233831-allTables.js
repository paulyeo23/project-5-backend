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

    await queryInterface.createTable("tableInfo", {
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
      flop1: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      flop2: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      flop3: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      turn: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      river: {
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

    await queryInterface.createTable("deck", {
      roundid: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "tableinfo",
          key: "roundid",
        },
      },
      deck: {
        allowNull: false,
        type: Sequelize.FLOAT,
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

    await queryInterface.createTable("tablePlayer", {
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
          model: "tableinfo",
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
      deck: {
        allowNull: false,
        type: Sequelize.FLOAT,
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

    await queryInterface.createTable("playerHand", {
      handid: {
        allowNull: false,
        references: {
          model: "tablePlayer",
          key: "handid",
        },
        type: Sequelize.INTEGER,
      },
      card: {
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("playerHand");
    await queryInterface.dropTable("tablePlayer");
    await queryInterface.dropTable("deck");
    await queryInterface.dropTable("tableInfo");
    await queryInterface.dropTable("transactions");
    await queryInterface.dropTable("users");
    await queryInterface.dropTable("tables");
  },
};
