const express = require("express");
const cors = require("cors");

const { authRouter } = require("./routes/auth.route.js");

const { notFound } = require("./middlewares/notFound.middleware.js");
const { errorHandler } = require("./middlewares/errorHandler.middleware.js");

const { connectDB } = require("./config/db.config.js");
const { PORT } = require("./config/env.config.js");

const app = express();

//---MIDDLEWARES--//
app.use(cors());
app.use(express.json());

//--ROUTES--//
app.use("/auth", authRouter);

//--ERROR HANDLING MIDDLEWARES--//
app.use(notFound);
app.use(errorHandler);

connectDB();

app.listen(PORT, () => {
  console.log(`my app listening on port ${PORT} successfully`);
});
