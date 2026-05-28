import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del producto es obligatorio"],
      trim: true,
    },

    group: {
      type: String,
      required: [true, "El grupo o artista es obligatorio"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: 0,
    },

    stock: {
      type: Number,
      required: [true, "El stock es obligatorio"],
      min: 0,
      default: 0,
    },

    image: {
      type: String,
      default: "https://placehold.co/500x500?text=KBeat+Store",
    },

    version: {
      type: String,
      default: "Standard",
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "La categoría es obligatoria"],
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    views: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;