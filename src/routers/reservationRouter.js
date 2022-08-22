const express = require("express");
const auth = require("../middleware/auth");
const Reservation = require("../models/reservationModel");
const Flight = require("../models/flightModel");

const router = new express.Router();

router.get("/reservations", auth, async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.send(reservations);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/reservations/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const reservation = await Reservation.findOne({ _id });

    if (!reservation) {
      return res.status(404).send();
    }
    res.send(reservation);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/reservations/flight/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const flight = await Flight.findOne({ _id });

    if (!flight) {
      return res.status(404).send("Flight not found.");
    }

    const reservations = await Reservation.find({ flight: _id });
    res.send(reservations);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/reservations", auth, async (req, res) => {
  const reservation = new Reservation({ ...req.body });

  try {
    const flight = await Flight.findOne({ _id: req.body.flight });

    if (!flight) {
      return res.status(404).send("Flight not found.");
    }

    const reservations = await Reservation.find({ flight: req.body.flight });
    let numOfSeats = flight.numberOfSeats;
    reservations.forEach((res) => (numOfSeats -= res.numberOfSeats));

    if (numOfSeats < req.body.numberOfSeats) {
      return res.status(400).send("Not enough seats left.");
    }

    await reservation.save();
    res.status(201).send(reservation);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch("/reservations/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "name",
    "lastName",
    "email",
    "flight",
    "numberOfSeats",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    const reservation = await Reservation.findOne({ _id: req.params.id });

    if (!reservation) {
      return res.status(404).send();
    }

    if (req.body.flight) {
      const flight = await Flight.findOne({ _id: req.body.flight });

      if (!flight) {
        return res.status(404).send("Flight not found.");
      }
    }

    updates.forEach((update) => (reservation[update] = req.body[update]));
    await reservation.save();
    res.send(reservation);
  } catch (error) {
    res.status(400).send();
  }
});

router.delete("/reservations/:id", auth, async (req, res) => {
  try {
    const reservation = await Reservation.findOneAndDelete({
      _id: req.params.id,
    });

    if (!reservation) {
      res.status(404).send();
    }

    res.send(reservation);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
