import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);

    res.status(201).json({
      message: "Categoría creada correctamente.",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear categoría.",
      error: error.message,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    res.json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener categorías.",
      error: error.message,
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Categoría no encontrada.",
      });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener categoría.",
      error: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!category) {
      return res.status(404).json({
        message: "Categoría no encontrada.",
      });
    }

    res.json({
      message: "Categoría actualizada correctamente.",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar categoría.",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Categoría no encontrada.",
      });
    }

    res.json({
      message: "Categoría eliminada correctamente.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar categoría.",
      error: error.message,
    });
  }
};