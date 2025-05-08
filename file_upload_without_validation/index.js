const express = require('express');
const multer = require('multer');
const path = require('path');
const {errorRes,successRes} = require('./response/msgcode');

const app = express();
const port = 3000;

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'uploads/');
  },
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname);
    const filename = `${file.originalname}`;
    callback(null, filename);
  },
});

const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));

app.post('/upload', upload.array('files'), (req, res) => {
  var uploadFiles = req.files;

  uploadFiles.map(file => {
    const totalSize = 3 * 1024 * 1024
    if(file.size > totalSize){
      return errorRes(res,201,"maximum size of file is 3MB");
    }
})

  if(uploadFiles.length == 0)
  {
    return errorRes(res,201,"Please Upload the file.");
  }
  return successRes(res,200,uploadFiles.map(file => `http://localhost:3000/uploads/${file.filename}`));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
