import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import methodOverride from "method-override";

import routes from "./routes/routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//mongodb connection

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected the database"));

// midlewares

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);

app.use(
  session({
    secret: "secret key",
    saveUninitialized: true,
    resave: false,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

app.use(express.static("upload"));

app.set("view engine", "ejs");

app.use("", routes);

app.listen(PORT, () => {
  console.log(`Server started at localhost:${PORT}`);
});
