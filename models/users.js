import mongoose from "mongoose";
import User from "../models/users.js";
import { unlink, access } from "node:fs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.render("index", { title: "Users", users });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error retrieving users");
  }
};

export const createUser = async (req, res) => {
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
};

export const deleteUser = async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);
  console.log(deletedUser);
  if (!deletedUser) {
    res.json({ message: "error", type: "danger" });
  } else {
    if (deletedUser.image != "") {
      if (access("upload/" + deletedUser.image, (err) => console.log(err))) {
        unlink("upload/" + deletedUser.image, (err) => {
          if (err) throw err;
          console.log("Image was deleted");
        });
      }
    }
    req.session.message = {
      type: "success",
      message: "User deleted successfully!",
    };
    res.redirect("/");
  }
};

export default mongoose.model("User", userSchema);
