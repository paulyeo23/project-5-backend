export default  function initTablesModel  (sequelize, DataTypes) {
  return sequelize.define(
    "tables",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      maxPlayer: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      blinds: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      timeLimit: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      openClose: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
    },
    {
      timestamps: false,
    },
  );
};


