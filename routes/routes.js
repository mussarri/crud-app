import express from "express";
const router = express.Router();
import multer from "multer";
import User from "../models/users.js";
import { unlink, stat } from "node:fs";
import { deleteUser, createUser, getAllUsers } from "../models/users.js";

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

router.get("/", getAllUsers);

router.get("/add", (req, res) => {
  res.render("add_user", { title: "Add User" });
});

router.post("/add", upload.single("image"), createUser);

router.get("/:id/edit", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.render("edit_user", { title: "Edit User", user });
  } else {
    res.send("error");
  }
});

router.post("/:id/update", upload.single("image"), async (req, res) => {
  const id = req.params.id;
  let newImage = "";
  if (req.file) {
    newImage = req.file.filename;
    unlink("upload/" + req.body.old_image, (err) => {
      if (err) throw err;
      console.log("Image was deleted");
    });
  }
  const updatedUser = await User.findByIdAndUpdate(id, {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.email,
    image: newImage,
  });
  if (updatedUser) {
    req.session.message = {
      type: "success",
      message: "User updated successfully!",
    };
    res.redirect("/");
  } else {
    res.json({ message: "error", type: "danger" });
  }
});

router.delete("/:id", deleteUser);

export default router;
