const { request } = require("express");
const express = require("express");
const auth = require("../middleware/auth");
const Destination = require("../models/destinationModel");

const router = new express.Router();

router.get("/destinations", async (req, res) => {
  try {
    const destination = await Destination.find();
    res.send(destination);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/destinations/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const destination = await Destination.findOne({ _id });

    if (!destination) {
      return res.status(404).send();
    }
    res.send(destination);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/destinations", auth, async (req, res) => {
  const destination = new Destination({ ...req.body });

  try {
    await destination.save();
    res.status(201).send(destination);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch("/destinations/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["country", "city"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    const destination = await Destination.findOne({ _id: req.params.id });

    if (!destination) {
      return res.status(404).send();
    }

    updates.forEach((update) => (destination[update] = req.body[update]));
    await destination.save();
    res.send(destination);
  } catch (error) {
    res.status(400).send();
  }
});

router.delete("/destinations/:id", auth, async (req, res) => {
  try {
    const destination = await Destination.findOneAndDelete({
      _id: req.params.id,
    });

    if (!destination) {
      res.status(404).send();
    }

    res.send(destination);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
