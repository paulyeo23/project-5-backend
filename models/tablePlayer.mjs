export default  function initTablePlayerModel  (sequelize, DataTypes)  {
  return sequelize.define(
    "tablePlayer",
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
        references: {
          model: "tableinfo",
          key: "roundid",
        },
      },
      userid: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
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
};
