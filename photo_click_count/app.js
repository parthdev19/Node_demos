const express = require('express');
const app = express();
app.use(express.json());
const session = require('express-session');
const path = require('path')
app.use(express.static(path.join(__dirname,'./public')));

const viewPath = path.join(__dirname, "./views");
app.set('view engine', 'ejs');
app.set('views', viewPath);

require('./db/conn');

// use session for login-logout
app.use(session({
  secret: 'photo_count', // Change this to your own secret key
  resave: false,
  saveUninitialized: true,
  // Additional options can be configured here
}));

const morgan = require('morgan');
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));


const adminRouter = require('./routes/R_admin');
app.use(adminRouter);
const clientRouter = require('./routes/R_client');
app.use(clientRouter);
const frontendViewRouter = require('./routes/R_frontend_view');
app.use(frontendViewRouter);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is Running on http://localhost:${port}`);
}); 