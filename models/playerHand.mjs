export default function initPlayerHandModel(sequelize, DataTypes) {
  return sequelize.define(
    "playerHand",
    {
      handid: {
        allowNull: false,
        references: {
          model: "tablePlayer",
          key: "handid",
        },
        type: DataTypes.INTEGER,
      },
      card: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },

    },
    {
      timestamps: false,
    },
  );
};
