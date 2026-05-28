import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      message: "Producto creado correctamente.",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear producto.",
      error: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const {
      search,
      group,
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 8,
    } = req.query;

    const query = {
      isActive: true,
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { group: { $regex: search, $options: "i" } },
      ];
    }

    if (group) {
      query.group = { $regex: group, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const products = await Product.find(query)
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limitNumber);

    res.json({
      products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: pageNumber,
        limit: limitNumber,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener productos.",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name description"
    );

    if (!product || !product.isActive) {
      return res.status(404).json({
        message: "Producto no encontrado.",
      });
    }

    product.views += 1;
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener producto.",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado.",
      });
    }

    res.json({
      message: "Producto actualizado correctamente.",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar producto.",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado.",
      });
    }

    res.json({
      message: "Producto eliminado correctamente.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar producto.",
      error: error.message,
    });
  }
};

export const getMostViewedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .sort({ views: -1 })
      .limit(5)
      .populate("category", "name");

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener reporte de productos.",
      error: error.message,
    });
  }
};