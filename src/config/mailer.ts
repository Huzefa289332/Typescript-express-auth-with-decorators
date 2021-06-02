import nodemailer from "nodemailer";
import { config } from "dotenv";

config();
export const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: `${process.env.EMAIL}`,
    pass: `${process.env.PASSWORD}`,
  },
});
