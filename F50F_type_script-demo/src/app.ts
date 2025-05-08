import path from "path";

import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';

// Initialize Express app
const app: express.Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT;

import i18n from "i18n";
i18n.configure({
  locales: ["en", "fr"],
  directory: path.join(__dirname, "./locale"),
  defaultLocale: "en",
  objectNotation: true,
});
app.use(i18n.init);

import morgan from "morgan";
morgan.token("host", function (req) {
  const request = req as express.Request;
  return request.hostname;
});
const customFormat = ':method :url :status :res[content-length] - :response-time ms :host';
app.use(morgan(customFormat));

//Database connection
import mongodbConnect from "./config/db.connect";
mongodbConnect();

import router from "./api/routes/app/v1/index.routes";
app.use(router);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// import express, { Request, Response, NextFunction } from 'express';
// import multer from 'multer';

// // Configure multer for file storage
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // Middleware to validate form data fields
// const validateFields = (req: Request, res: Response, next: NextFunction): void => {
//   const { name, email, age, mobile } = req.body;

//   // Check if required fields are present
//   if (!name || !email || !age || !mobile) {
//     res.status(400).json({ message: 'Missing required fields: name, email, age, mobile' });
//     return;
//   }

//   // Optional: Additional validation can be added here (e.g., regex for email, number for age and mobile)
//   if (!/^\S+@\S+\.\S+$/.test(email)) {
//     res.status(400).json({ message: 'Invalid email format' });
//     return;
//   }
//   if (isNaN(Number(age)) || isNaN(Number(mobile))) {
//     res.status(400).json({ message: 'Age and mobile should be numeric values' });
//     return;
//   }

//   // Proceed to the next middleware if validation passes
//   next();
// };

// // Define the POST route to accept form-data
// app.post(
//   '/upload',
//   upload.none(),  // Only allow fields without files
//   validateFields, // Validate the fields
//   (req: Request, res: Response) => {
//     try {
//       // Extract validated form data
//       const { name, email, age, mobile } = req.body;

//       // Send response with the received data
//       res.status(200).json({
//         message: 'Form data received successfully',
//         data: { name, email, age, mobile },
//       });
//     } catch (error) {
//       res.status(500).json({ message: 'Error processing request', error });
//     }
//   }
// );




