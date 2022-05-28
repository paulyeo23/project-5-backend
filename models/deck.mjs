export default function initDeckModel(sequelize, DataTypes) {
  return sequelize.define(
    "decks",
    {
      roundid: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "tableinfos",
          key: "roundid",
        },
      },
      deck: {
        allowNull: false,
        type: DataTypes.STRING,
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
