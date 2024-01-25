const { Router } = require("express");
const { Card } = require("../../db");

const router = Router();

router.get("/card", async (req, res) => {
  try {
    const cards = await Card.findAll();
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta POST para crear una nueva Card
router.post("/card", async (req, res) => {
  try {
    const { text, size, imageUrl, price } = req.body;

    const newCard = await Card.create({
      text,
      size,
      imageUrl,
      price,
    });

    res.status(201).json(newCard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar una tarjeta
router.put("/card/:id", async (req, res) => {
  const { id } = req.params;
  const { text, size, imageUrl, price } = req.body;

  try {
    const card = await Card.findByPk(id);
    if (!card) {
      return res.status(404).send("Tarjeta no encontrada.");
    }

    card.text = text;
    card.size = size;
    card.imageUrl = imageUrl;
    card.price = price;

    await card.save();

    res.status(200).json(card);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta DELETE para eliminar una tarjeta por su ID
router.delete("/card/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Busca la card por su ID
    const cardDelete = await Card.findByPk(id);

    if (!cardDelete) {
      res.status(404).json("Tarjeta no encontrada.");
    }

    await cardDelete.destroy();

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
