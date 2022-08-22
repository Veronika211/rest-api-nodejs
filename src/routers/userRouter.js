const express = require("express");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const User = require("../models/userModel");

const router = express.Router();

//create user
router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});
//delete user
router.delete("/users/:id", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).send();
    }

    res.status(201).send(user);
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/login", async (req, res) => {
  const { email, password } = req.body;

  let existingUser;

  if (!email || !password) {
    return res.status(400).send();
  }

  try {
    existingUser = await User.findOne({ email: email });
    console.log(existingUser);
    if (!existingUser) {
      return res.status(404).send();
    }

    if (!bcrypt.compareSync(password, existingUser.password)) {
      return res.status(400).send();
    }

    const token = await existingUser.generateAuthToken();
    res.send({ existingUser, token });
  } catch (err) {
    console.log(err);
    return res.status(400).send();
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
