const express = require('express');
const router = express.Router();
const adminController = require("../controllers/C_admin")
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

router.post('/adminSignin',multipartMiddleware, adminController.adminSignin);
router.post('/adminLogin',multipartMiddleware, adminController.adminlogin);
router.post('/picture',adminController.upload.single('product_picture'),adminController.addPicture)
router.get('/photo_view',adminController.album_view_all_picture);
router.get('/logout', multipartMiddleware,adminController.adminlogout);
router.post('/deleted_picture',multipartMiddleware,adminController.delete_Picture);

module.exports = router;
