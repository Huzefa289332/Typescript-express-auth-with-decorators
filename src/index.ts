import express from "express";
import { config } from "dotenv";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { notFound, errorHandler } from "./middlewares";
import { AppRouter } from "./router/AppRouter";
import { connectDB } from "./config/db";
import "express-async-errors";
import "./controllers";

config();

const app = express();

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.env === "development" ? false : true,
  })
);
app.use(AppRouter.getInstance());
app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Listening in port ${process.env.PORT}`);
});
