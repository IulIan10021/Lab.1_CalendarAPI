const express = require("express");
const app = express();
const eventsRouter = require("./routes/events");

// Middleware pentru JSON
app.use(express.json());

// Rute principale
app.use("/", eventsRouter);

// Pornire server
app.listen(3000, () => console.log("Server pornit pe http://localhost:3000"));
