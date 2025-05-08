import path from "path";

import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';

// Initialize Express app
const app: express.Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Localization settings
import i18n from "i18n";
i18n.configure({
  locales: ["en"],
  directory: path.join(__dirname, "./localization"),
  defaultLocale: "en",
  objectNotation: true,
});
app.use(i18n.init);

// Morgan settings
import morgan from "morgan";
morgan.token("host", function (req) {
  const request = req as express.Request;
  return request.hostname;
});
const customFormat = ':method :url :status :res[content-length] - :response-time ms :host';
app.use(morgan(customFormat));

// router setup for app
import router from "./api/routes/admin/index.routes";
app.use(router);

//Database connection
import mongodbConnect from "./config/db.connect";
mongodbConnect();

// For access the public folder
app.use(express.static(path.join(__dirname,'./public')));


// Start the server
const PORT = process.env.ADMIN_PORT;
app.listen(PORT, () => {
  console.log(`Admin server is running on http://localhost:${PORT}`);
});