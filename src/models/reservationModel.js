const mongoose = require("mongoose");
const validator = require("validator");

const reservationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is not valid");
      }
    },
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  numberOfSeats: {
    type: Number,
    required: true,
  },
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Flight",
  },
});

const Reservation = mongoose.model("Reservation", reservationSchema);
module.exports = Reservation;
