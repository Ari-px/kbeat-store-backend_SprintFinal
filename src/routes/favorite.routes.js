import express from "express";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../controllers/favorite.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getFavorites);
router.post("/:productId", protect, addFavorite);
router.delete("/:productId", protect, removeFavorite);

export default router;