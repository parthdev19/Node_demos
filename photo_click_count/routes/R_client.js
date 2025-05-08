const express = require('express');
const router = express.Router();
const clientController = require("../controllers/C_client");
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart()

router.post("/addView",multipartMiddleware,clientController.IncPictureView);

module.exports = router;