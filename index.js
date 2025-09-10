const express = require("express");
const app = express();

// ACTIVEAZĂ PARSER-UL JSON
app.use(express.json());

const eventsRouter = require("./routes/events");
app.use("/", eventsRouter);

app.listen(3000, () => console.log("Server pornit pe http://localhost:3000"));
