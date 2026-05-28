import express from "express";
import {
  createProduct,
  deleteProduct,
  getMostViewedProducts,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/report/most-viewed", protect, adminOnly, getMostViewedProducts);
router.get("/:id", getProductById);

router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;