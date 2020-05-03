// load express and multer
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 8889
const directoryPath = process.cwd() + "/images";

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function fileFilter(req, file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif|webP/;

    // Check ext
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Images Only!");
    }
  },
});

app.listen(port, () => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Started on port" +  port);
        console.log("Images directory has been created");
      }
    });
  }
});
app.get("/", (req, res) => {
  res.send("Its you not me ! :D");
});

app.post("/image", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).send(err);
    }
    res.send(req.file);
  });
});

app.post("/images", upload.array("images"), (req, res) => {
  try {
    res.send(req.files);
  } catch (error) {
    console.log(error);
    res.send(400);
  }
});

app.get("/listAllImages", (req, res) => {
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
      res.status(500).send(err)
      return console.log("Unable to scan directory: " + err);
    }
    //listing all files using forEach
    var filesArray = [];
    files.forEach(function (file) {
      filesArray.push(file);
    });
    res.send(filesArray);
  });
});
