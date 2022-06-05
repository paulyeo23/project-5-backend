export default function initTablePlayerModel(sequelize, DataTypes) {
  return sequelize.define(
    "tablePlayers",
    {
      handid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      roundid: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      userid: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      tablePosition: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      check: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      folded: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      stack: {
        allowNull: false,
        type: DataTypes.FLOAT,
        defaultValue: false,
      },
      called: {
        type: DataTypes.FLOAT,
        defaultValue: false,
      },
      allIn: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: false,
    },
  );
}
