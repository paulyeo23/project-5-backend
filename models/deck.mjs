export default function initDeckModel(sequelize, DataTypes) {
  return sequelize.define(
    "deck",
    {
      roundid: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "tableinfo",
          key: "roundid",
        },
      },
      deck: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      deckPosition: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      timestamps: false,
    },
  );
}
