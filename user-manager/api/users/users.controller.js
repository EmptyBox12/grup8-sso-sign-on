const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("../_middleware/validate-request");
const authMiddleware = require("../_middleware/authMiddleware");
const Role = require("../_helpers/role");
const userService = require("./user.service");
// routes
router.get("/", authMiddleware, getAll);
router.get("/:id",authMiddleware, getById);
router.post("/", authMiddleware, createSchema, create); //schema fonksiyonunu cagırarak gelen datanın uygun olup olmadıgına bakıyorum
router.put("/:id",authMiddleware, updateSchema, update);
router.delete("/:id", authMiddleware, _delete);


module.exports = router;

// route functions

function getAll(req, res, next) {
  userService
    .getAll()
    .then((users) => res.json(users))
    .catch(next);
}

function getById(req, res, next) {
  userService
    .getById(req.params.id)
    .then((user) => res.json(user))
    .catch(next);
}

function create(req, res, next) {
  userService
    .create(req.body)
    .then(() => res.json({ message: "User created" }))
    .catch(next);
}

function update(req, res, next) {
  userService
    .update(req.params.id, req.body)
    .then(() => res.json({ message: "User updated" }))
    .catch(next);
}

function _delete(req, res, next) {
  userService
    .delete(req.params.id)
    .then(() => res.json({ message: "User deleted" }))
    .catch(next);
}

// schema functions

function createSchema(req, res, next) {
  const schema = Joi.object({
    username: Joi.string().required(),
    user_name: Joi.string().required(),
    user_surname: Joi.string().required(),
    user_type: Joi.string().valid(Role.Admin, Role.User).required(),
    user_email: Joi.string().email().required(),
    user_password: Joi.string().min(6).required(),
  });
  validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    username: Joi.string().empty(""),
    user_name: Joi.string().empty(""),
    user_surname: Joi.string().empty(""),
    user_type: Joi.string().valid(Role.Admin, Role.User).empty(""),
    user_email: Joi.string().email().empty(""),
    user_password: Joi.string().min(6).empty(""),
  });
  validateRequest(req, next, schema);
}
