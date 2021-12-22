const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    username: { type: DataTypes.STRING, allowNull: false },
    user_name: { type: DataTypes.STRING, allowNull: false },
    user_surname: { type: DataTypes.STRING, allowNull: false },
    user_password: { type: DataTypes.STRING, allowNull: false },
    user_email: { type: DataTypes.STRING, allowNull: false },
    user_type: { type: DataTypes.STRING, allowNull: false },
  };
  //password bilgi olarak dönmesini istemediğim için devre dışı bıraktım.(postmandede gözükmüyor)
  const options = {
    defaultScope: {
      // exclude password hash by default.
      attributes: { exclude: ["user_password"] },
    },
    scopes: {
      // include hash with this scope
      withHash: { attributes: {} },
    },
  };
  //sequlazi define ederek tablo oluşturdum.
  return sequelize.define("User", attributes, options);
}
