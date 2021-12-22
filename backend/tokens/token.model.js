const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    token: { type: String },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
  };

  return sequelize.define("Token", attributes);
}
