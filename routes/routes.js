import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "Home Page" });
});

router.get("/add", (req, res) => {
  res.render("add_user", { title: "Add User" });
});

export default router;
