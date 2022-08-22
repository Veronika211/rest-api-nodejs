const { request } = require("express");
const express = require("express");
const auth = require("../middleware/auth");
const Flight = require("../models/flightModel");
const Destination = require("../models/destinationModel");

const router = new express.Router();

router.get("/flights", async (req, res) => {
  try {
    const flights = await Flight.find();
    res.send(flights);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/flights/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const flight = await Flight.findOne({ _id });

    if (!flight) {
      return res.status(404).send();
    }
    res.send(flight);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/flights/destinations/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const destination = await Destination.findOne({ _id });

    if (!destination) {
      return res.status(404).send("Destination not found.");
    }

    const flights = await Flight.find({ destination: _id });
    res.send(flights);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/flights", auth, async (req, res) => {
  const flight = new Flight({ ...req.body });

  try {
    const destination = await Destination.findOne({
      _id: req.body.destination,
    });

    if (!destination) {
      return res.status(404).send("Destination not found.");
    }

    await flight.save();
    res.status(201).send(flight);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch("/flights/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "date",
    "airplaneNumber",
    "numberOfSeats",
    "destination",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    const flight = await Flight.findOne({ _id: req.params.id });

    if (!flight) {
      return res.status(404).send();
    }

    if (req.body.destination) {
      const destination = await Destination.findOne({
        _id: req.body.destination,
      });

      if (!destination) {
        return res.status(404).send("Destination not found.");
      }
    }

    updates.forEach((update) => (flight[update] = req.body[update]));
    await flight.save();
    res.send(flight);
  } catch (error) {
    res.status(400).send();
  }
});

router.delete("/flights/:id", auth, async (req, res) => {
  try {
    const flight = await Flight.findOneAndDelete({ _id: req.params.id });

    if (!flight) {
      res.status(404).send();
    }

    res.send(flight);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
