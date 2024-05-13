import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import FileUpload from "express-fileupload";
import UserRoute from "./routes/UserRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import mongoose from "mongoose";

dotenv.config();

const port = process.env.APP_PORT || 5000;
const dbURI = process.env.DATABASE;

const app = express();

app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    origin: "http://localhost:5173",
  })
);

// Middleware
app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: "auto",
    },
  })
);

app.use(express.json());
app.use(FileUpload());
app.use(express.static("public"));

app.use(UserRoute);
app.use(AuthRoute);

mongoose
  .connect(dbURI, {})
  .then(() => {
    console.log("Connected to database");
    app.listen(port, () => {
      console.log("server listening on " + port);
    });
  })
  .catch((err) => {
    console.error("error connecting to Database", err.message);
  });
