import express from "express";

const router = express.Router();

router.get("/itunes/:term", async (req, res) => {
  try {
    const { term } = req.params;

    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
      term
    )}&entity=album&limit=6`;

    const response = await fetch(url);
    const data = await response.json();

    res.json({
      message: "Datos obtenidos desde API externa de iTunes.",
      results: data.results,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al consumir API externa.",
      error: error.message,
    });
  }
});

export default router;