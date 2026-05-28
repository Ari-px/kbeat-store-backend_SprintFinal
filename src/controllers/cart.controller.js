import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const calculateCartTotal = async (cart) => {
  let total = 0;

  for (const item of cart.products) {
    const product = await Product.findById(item.product);

    if (product) {
      total += product.price * item.quantity;
    }
  }

  cart.total = total;
  await cart.save();

  return cart;
};

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "products.product"
    );

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        products: [],
        total: 0,
      });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener carrito.",
      error: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      return res.status(404).json({
        message: "Producto no encontrado.",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        message: "No hay stock suficiente.",
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        products: [],
      });
    }

    const productInCart = cart.products.find(
      (item) => item.product.toString() === productId
    );

    if (productInCart) {
      productInCart.quantity += Number(quantity);
    } else {
      cart.products.push({
        product: productId,
        quantity: Number(quantity),
      });
    }

    await calculateCartTotal(cart);

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate(
      "products.product"
    );

    res.json({
      message: "Producto agregado al carrito.",
      cart: updatedCart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al agregar al carrito.",
      error: error.message,
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        message: "Carrito no encontrado.",
      });
    }

    const item = cart.products.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        message: "Producto no encontrado en el carrito.",
      });
    }

    item.quantity = Number(quantity);

    await calculateCartTotal(cart);

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate(
      "products.product"
    );

    res.json({
      message: "Cantidad actualizada.",
      cart: updatedCart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar carrito.",
      error: error.message,
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        message: "Carrito no encontrado.",
      });
    }

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== productId
    );

    await calculateCartTotal(cart);

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate(
      "products.product"
    );

    res.json({
      message: "Producto eliminado del carrito.",
      cart: updatedCart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar producto del carrito.",
      error: error.message,
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        message: "Carrito no encontrado.",
      });
    }

    cart.products = [];
    cart.total = 0;

    await cart.save();

    res.json({
      message: "Carrito vaciado correctamente.",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al vaciar carrito.",
      error: error.message,
    });
  }
};