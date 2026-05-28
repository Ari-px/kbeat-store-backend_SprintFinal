import Favorite from "../models/Favorite.js";
import Product from "../models/Product.js";

export const getFavorites = async (req, res) => {
  try {
    let favorites = await Favorite.findOne({ user: req.user._id }).populate(
      "products"
    );

    if (!favorites) {
      favorites = await Favorite.create({
        user: req.user._id,
        products: [],
      });
    }

    res.json(favorites);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener favoritos.",
      error: error.message,
    });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado.",
      });
    }

    let favorites = await Favorite.findOne({ user: req.user._id });

    if (!favorites) {
      favorites = await Favorite.create({
        user: req.user._id,
        products: [],
      });
    }

    const alreadyExists = favorites.products.some(
      (id) => id.toString() === productId
    );

    if (alreadyExists) {
      return res.status(400).json({
        message: "El producto ya está en favoritos.",
      });
    }

    favorites.products.push(productId);
    await favorites.save();

    const updatedFavorites = await Favorite.findOne({
      user: req.user._id,
    }).populate("products");

    res.json({
      message: "Producto agregado a favoritos.",
      favorites: updatedFavorites,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al agregar favorito.",
      error: error.message,
    });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { productId } = req.params;

    const favorites = await Favorite.findOne({ user: req.user._id });

    if (!favorites) {
      return res.status(404).json({
        message: "Favoritos no encontrados.",
      });
    }

    favorites.products = favorites.products.filter(
      (id) => id.toString() !== productId
    );

    await favorites.save();

    const updatedFavorites = await Favorite.findOne({
      user: req.user._id,
    }).populate("products");

    res.json({
      message: "Producto eliminado de favoritos.",
      favorites: updatedFavorites,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar favorito.",
      error: error.message,
    });
  }
};