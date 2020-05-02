// load express and multer
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();

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

app.listen(8889, () => {
  console.log("Started on port 8889");
  const dir = process.cwd() + "/images";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Images directory has been created");
      }
    });
  }
});
app.get("/", (req, res) => {
  res.send("hello world");
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
