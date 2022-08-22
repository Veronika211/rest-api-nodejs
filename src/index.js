const express = require("express");
require("./db/mongoose");
const app = express();
const userRouter = require("./routers/userRouter");
const destinationRouter = require("./routers/destinationRouter");
const flightRouter = require("./routers/flightRouter");
const reservationRouter = require("./routers/reservationRouter");

const port = 3000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  //zovemo next jer sledeca funkcija treba da se izvrsi
  next();
});

app.use(express.json());
app.use(userRouter);
app.use(destinationRouter);
app.use(flightRouter);
app.use(reservationRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
