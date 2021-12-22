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
  return await db.User.findAll();
}
//id e göre
async function getById(id) {
  return await getUser(id);
}

async function create(params) {
  // validate(mail daha önce kullanılmışmı kullanılmamışmı ona bakılıyor)
  if (await db.User.findOne({ where: { user_email: params.user_email } })) {
    throw 'Email "' + params.user_email + '" is already registered';
  }
  const user = new db.User(params);

  // save user
  await user.save();
}

async function update(id, params) {
  const user = await getUser(id);

  // validate(username daha önce kullanılmısmı kullanılmamısmı ona bakılıyor)
  const usernameChanged = params.username && user.username !== params.username;
  if (
    usernameChanged &&
    (await db.User.findOne({ where: { username: params.username } }))
  ) {
    throw 'Username "' + params.username + '" is already taken';
  }

  // copy params to user and save
  Object.assign(user, params);
  await user.save();
}
//silme işlemi
async function _delete(id) {
  const user = await getUser(id);
  await user.destroy();
}

// helper functions
//pk ye göre varsa bul yoksa user not found döndür
async function getUser(id) {
  const user = await db.User.findByPk(id);
  if (!user) throw "User not found";
  return user;
}
