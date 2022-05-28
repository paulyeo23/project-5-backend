export default function initTableInfoModel(sequelize, DataTypes) {
  return sequelize.define(
    "tableInfos",
    {
      roundid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      tableid: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "tables",
          key: "id",
        },
      },
      dealerPosition: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      currentPosition: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      pot: {
        type: DataTypes.INTEGER,
      },
      raisePosition: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      currentRaise: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      previousRaise: {
        allowNull: false,
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      gameState: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      nextGame: {
        type: DataTypes.INTEGER,
      },
    },
    {
      timestamps: false,
    },
  );
}
