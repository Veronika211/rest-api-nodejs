const mongoose = require("mongoose");
const Flight = require("./flightModel");

const destinationSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
});

destinationSchema.virtual("flights", {
  ref: "Flight",
  localField: "_id",
  foreignField: "destination",
});

destinationSchema.pre("remove", async function (next) {
  const destination = this;
  await Flight.deleteMany({ destination: destination._id });

  next();
});

const Destination = mongoose.model("Destination", destinationSchema);
module.exports = Destination;
