const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");

const auth = require("../middlewares/auth");
const genToken = require("../middlewares/token");
const { User, validate } = require("../models/user");
const { find } = require("lodash");

router.post("/register", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const alreadyExists = await User.find({ email: req.body.email });
  if (alreadyExists.length !== 0)
    return res.status(400).send("user already exists!!");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  const token = genToken(user);
  await user.save();
  res.header("x-auth-token", token).send(_.pick(user, ["name", "email"]));
});

router.post("/login", async (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).send("provide email and password");
  const user = await User.findOne({ email: req.body.email });
  if (user.length === 0)
    return res.status(400).send("invalid email or password!!");

  const comparedPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!comparedPassword)
    return res.status(400).send("invalid email or password!!");

  const token = genToken(user);
  res.header("x-auth-token", token).send(_.pick(user, ["name", "email"]));
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.send(_.pick(user, ["name", "email", "_id"]));
});

router.get("/logout", auth, (req, res) => {
  res.send("logout").removeHeader("x-auth-token");
});

module.exports = router;
