const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();
const API_URL = process.env.API_URL;

// 🏠 Home Route (Fetch Pokémon List)
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}?limit=20`);

    // Add ID and Image URL for each Pokémon
    const pokemonList = response.data.results.map((pokemon, index) => ({
      name: pokemon.name,
      id: index + 1, // PokeAPI uses 1-based index
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
        index + 1
      }.png`,
    }));

    return res.render("pages/home", { pokemonList });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// 🛑 Updated: Fetch Pokémon Details as JSON for Modal
router.get("/pokemon/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const response = await axios.get(`${API_URL}/${name.toLowerCase()}`);

    // Return JSON response for the modal
    return res.json(response.data);
  } catch (error) {
    console.error("Error fetching Pokémon:", error.response?.status);

    if (error.response?.status === 404) {
      return res.status(404).json({ message: "Pokémon not found" });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// 🔍 Updated: Search Route (Returns JSON)
router.get("/search", async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const response = await axios.get(`${API_URL}/${name.toLowerCase()}`);

    return res.json(response.data);
  } catch (error) {
    console.error("Search Error:", error.response?.status);

    if (error.response?.status === 404) {
      return res.status(404).json({ message: "Pokémon not found" });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
