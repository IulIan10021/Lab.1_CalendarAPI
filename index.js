const express = require("express");
const app = express();

// Import corect – acum fișierul e în același folder
const eventsRouter = require("./routes/events");

app.use("/", eventsRouter);

const PORT = 3000;
app.listen(PORT, () => console.log("Server pornit pe http://localhost:3000"));
