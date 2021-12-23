const db = require("../_helpers/db");

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};
//databaseden tüm kayıtları listele
async function getAll() {
  return await db.sequelize.query("call getAll()", function (err, result) {
    if (err) {
      console.log("err:", err);
    } else {
      console.log("results:", result);
    }
  });
}
//id e göre
async function getById(id) {
  return await db.sequelize.query(
    "call getById(?)",
    { replacements: [id], type: db.sequelize.QueryTypes.RAW },
    function (err, result) {
      if (err) {
        console.log("err:", err);
      } else {
        console.log("results:", result);
      }
    }
  );
}

async function create(params) {
  const users = await db.sequelize.query("call getAll()");
  users.forEach((user) => {
    if (
      params.username === user.username ||
      params.user_email === user.user_email
    ) {
      throw "User info is already taken";
    }
  });
  let date_ob = new Date();
  return await db.sequelize.query(
    "call create_user(?,?,?,?,?,?,?,?)",
    {
      replacements: [
        params.username,
        params.user_name,
        params.user_surname,
        params.user_password,
        params.user_email,
        params.user_type,
        date_ob,
        date_ob,
      ],
      type: db.sequelize.QueryTypes.RAW,
    },
    function (err, result) {
      if (err) {
        console.log("err:", err);
      } else {
        console.log("results:", result);
      }
    }
  );
}

async function update(id, params) {
  const users = await db.sequelize.query("call getAll()");
  users.forEach((user) => {
    if (user.id != id)
      if (
        params.username === user.username ||
        params.user_email === user.user_email
      ) {
        throw "User info is already taken";
      }
  });
  let date_ob = new Date();
  return await db.sequelize.query(
    "call update_user(?,?,?,?,?,?,?,?)",
    {
      replacements: [
        params.username,
        params.user_name,
        params.user_surname,
        params.user_password,
        params.user_email,
        params.user_type,
        id,
        date_ob,
      ],
      type: db.sequelize.QueryTypes.RAW,
    },
    function (err, result) {
      if (err) {
        console.log("err:", err);
      } else {
        console.log("results:", result);
      }
    }
  );
}
//silme işlemi
async function _delete(id) {
  return await db.sequelize.query(
    "call delete_user(?)",
    { replacements: [id], type: db.sequelize.QueryTypes.RAW },
    function (err, result) {
      if (err) {
        console.log("err:", err);
      } else {
        console.log("results:", result);
      }
    }
  );
}
