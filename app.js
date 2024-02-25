const express = require('express');
const multer  = require('multer');
const path = require('path');

const app = express();
const port = 3100;

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Uploads directory
  },
  filename: function (req, file, cb) {
      const now = new Date();
      console.log('file.originalname',file.originalname)
      cb(null, `(${now.toLocaleString()}) - ${file.originalname}`) // Keep the original file name
    }
});

const upload = multer({ storage: storage });

// POST route for file upload
app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file)
  res.send('File uploaded successfully');
});

// Serve uploaded files
app.use('/files', express.static(path.join(__dirname, 'uploads')));

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
