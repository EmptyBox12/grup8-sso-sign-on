const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("../_middleware/validate-request");
const Role = require("../_helpers/role");
const userService = require("./user.service");

// routes

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", createSchema, create);
router.put("/:id", updateSchema, update);
router.delete("/:id", _delete);

module.exports = router;

// route functions

function getAll(req, res, next) {
  userService
    .getAll(req.params.token)
    .then((users) => res.json(users))
    .catch(next);
}

function getById(req, res, next) {
  userService
    .getById(req.params.token, req.params.id)
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
    .update(req.params.token, req.params.id, req.body)
    .then(() => res.json({ message: "User updated" }))
    .catch(next);
}

function _delete(req, res, next) {
  userService
    .delete(req.params.token, req.params.id)
    .then(() => res.json({ message: "User deleted" }))
    .catch(next);
}

// schema functions

function createSchema(req, res, next) {
  const schema = Joi.object({
    token: Joi.string().required(),
    username: Joi.string().required(),
    user_name: Joi.string().required(),
    user_surname: Joi.string().required(),
    user_type: Joi.string().valid(Role.Admin, Role.User).required(),
    user_email: Joi.string().email().required(),
    user_password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref("user_password")).required(),
  });
  validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    token: Joi.string().empty(""),
    username: Joi.string().empty(""),
    user_name: Joi.string().empty(""),
    user_surname: Joi.string().empty(""),
    user_type: Joi.string().valid(Role.Admin, Role.User).empty(""),
    user_email: Joi.string().email().empty(""),
    user_password: Joi.string().min(6).empty(""),
    confirmPassword: Joi.string().valid(Joi.ref("user_password")).empty(""),
  }).with("user_password", "confirmPassword");
  validateRequest(req, next, schema);
}
