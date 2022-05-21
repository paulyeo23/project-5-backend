export default function initUsersModel(sequelize, DataTypes) {
  return sequelize.define(
    "users",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      username: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      password: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      accountValue: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
    },
    {
      timestamps: false,
    },
  );
}
