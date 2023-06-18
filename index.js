import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import cors from "cors";

import {
  registerValidation,
  loginValidation,
  portfolioCreateValidation,
} from "./validations.js";

import { checkAuth, handleValidationErrors } from "./utils/index.js";

import { PortfolioController, UserController } from "./controllers/index.js";

mongoose
  .connect(
    "mongodb+srv://mc6rut:wwwwww@cluster0.dl2sljb.mongodb.net/portfolio?retryWrites=true&w=majority"
  )
  .then(() => console.log("db connect"))
  .catch((err) => console.log("db", err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.filename}`,
  });
});

app.get("/portfolio", PortfolioController.getAll);
app.get("/portfolio/:id", PortfolioController.getOne);
app.post(
  "/portfolio",
  checkAuth,
  portfolioCreateValidation,
  handleValidationErrors,
  PortfolioController.create
);
app.patch(
  "/portfolio/:id",
  checkAuth,
  portfolioCreateValidation,
  handleValidationErrors,
  PortfolioController.update
);
app.delete("/portfolio/:id", checkAuth, PortfolioController.remove);

app.use("*", function (req, res) {
  res.status(404).json({
    success: false,
    msg: "Не удалось получить страницу",
  });
});

app.listen(3030, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("server started");
});
