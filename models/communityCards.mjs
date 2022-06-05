export default function initCommunityCardsModel(sequelize, DataTypes) {
  return sequelize.define(
    "communityCards",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      roundid: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "tableinfos",
          key: "roundid",
        },
      },
      card: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: 0,
      },
    },
    {
      timestamps: false,
    },
  );
}
