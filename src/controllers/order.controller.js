import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "products.product"
    );

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({
        message: "El carrito está vacío.",
      });
    }

    for (const item of cart.products) {
      const product = await Product.findById(item.product._id);

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `No hay stock suficiente de ${product.name}.`,
        });
      }

      product.stock -= item.quantity;
      await product.save();
    }

    const orderProducts = cart.products.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const order = await Order.create({
      user: req.user._id,
      products: orderProducts,
      total: cart.total,
      status: "pendiente",
    });

    cart.products = [];
    cart.total = 0;

    await cart.save();

    res.status(201).json({
      message: "Pedido creado correctamente.",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear pedido.",
      error: error.message,
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener tus pedidos.",
      error: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener pedidos.",
      error: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      return res.status(404).json({
        message: "Pedido no encontrado.",
      });
    }

    res.json({
      message: "Estado del pedido actualizado.",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar pedido.",
      error: error.message,
    });
  }
};