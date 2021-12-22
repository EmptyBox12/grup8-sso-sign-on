const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const db = require("../_helpers/db");

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll(token) {
  const userToken = await getTokenUser(token);
  if (userToken) return await db.User.findAll();
}

async function getById(token, id) {
  const userToken = await getTokenUser(token);
  if (userToken) return await getUser(id);
}

async function create(params) {
  // validate
  if (await db.User.findOne({ where: { user_email: params.user_email } })) {
    throw 'Email "' + params.user_email + '" is already registered';
  }
  const user = new db.User(params);

  // hash password
  user.user_password = await bcrypt.hash(params.user_password, 10);

  // save user
  if (params.token) {
    await user.save();
    let token_user = await getUserByUsername(params.username);
    const new_token_info = {
      token: params.token,
      user_id: token_user.id,
    };
    const new_token_object = new db.Token(new_token_object);
    await token.save(new_token_object);
  } else throw "Token not found";
}

async function update(token, id, params) {
  const user = await getUser(id);
  const token = await getTokenUser(token);

  // validate
  const usernameChanged = params.username && user.username !== params.username;
  if (
    usernameChanged &&
    (await db.User.findOne({ where: { username: params.username } }))
  ) {
    throw 'Username "' + params.username + '" is already taken';
  }

  // hash password if it was entered
  if (params.user_password) {
    params.user_password = await bcrypt.hash(params.user_password, 10);
  }

  // copy params to user and save
  Object.assign(user, params);
  await user.save();
}

async function _delete(token, id) {
  const user = await getUser(id);
  const userToken = await getTokenUser(token);
  await user.destroy(), userToken.destroy();
}

// helper functions

async function getUser(id) {
  const user = await db.User.findByPk(id);
  if (!user) throw "User not found";
  return user;
}
async function getUserByUsername(username) {
  const user = await db.User.findOne({ where: { username: username } });
  if (!user) throw "User not found";
  return user;
}
async function getTokenUser(token) {
  const token = await db.Token.findOne({ where: { token: token } });
  if (!token) throw "Token not found";
  return token;
}
