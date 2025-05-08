const express = require("express");
const router = new express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

const studentControlller = require("../controllers/C_student");

// Get API
router.get("/display", studentControlller.display);
router.get("/display_id/:id",studentControlller.displayById);

//Post API
router.post("/addstudent",multipartMiddleware,studentControlller.addStudent)

//Delete API 
router.delete("/removestudent/:id",studentControlller.removeStud);

//Update API
router.patch("/editstudent/:id",multipartMiddleware,studentControlller.updateStud);

module.exports = router;

