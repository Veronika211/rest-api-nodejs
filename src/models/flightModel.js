const mongoose = require("mongoose");
const Reservation = require("../models/reservationModel");

const flightSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  airplaneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  numberOfSeats: {
    type: Number,
    required: true,
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Destination",
  },
});

flightSchema.virtual("reservations", {
  ref: "Reservation",
  localField: "_id",
  foreignField: "flight",
});

flightSchema.pre("remove", async function (next) {
  const flight = this;
  await Reservation.deleteMany({ flight: flight._id });

  next();
});

const Flight = mongoose.model("Flight", flightSchema);
module.exports = Flight;
