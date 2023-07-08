import express from "express";
const router = express.Router();
import multer from "multer";
import User from "../models/users.js";

// image upload
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload/");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.render("index", { title: "Users", users });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error retrieving users");
  }
});

router.get("/add", (req, res) => {
  res.render("add_user", { title: "Add User" });
});

router.post("/add", upload.single("image"), async (req, res) => {
  console.log(req);
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    image: req.file.filename,
  });
  const newUser = await user.save();
  if (newUser) {
    req.session.message = {
      type: "success",
      message: "User added successfully!",
    };
    res.redirect("/");
  } else {
    res.json({ message: "error", type: "danger" });
  }
});

export default router;
