import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";

import SequelizeStore from "connect-session-sequelize";
import FileUpload from "express-fileupload";

import UserRoute from "./routes/UserRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import mongoose from "mongoose";

const app = express();

// const sessionStore = SequelizeStore(session.Store);
// const store = new sessionStore({
//   db: db,
// });

/* (async() => {
    await db.sync();
})(); */

dotenv.config();

// Middleware
// app.use(
//   session({
//     secret: process.env.SESS_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     store: store,
//     cookie: {
//       secure: "auto",
//     },
//   })
// );

app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.use(FileUpload());
app.use(express.static("public"));

app.use(UserRoute);
app.use(AuthRoute);

// store.sync();

// app.listen(process.env.APP_PORT, () => {
//     console.log('Server up and running...');
// });
const port = process.env.APP_PORT || 5000;
const dbURI = process.env.DATABASE;
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
