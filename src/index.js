require("dotenv").config();
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const BASE_URL = "https://restcountries.com/v3.1";

// ─────────────────────────────────────────────
// GET /countries — Lista todos los países (con campos limitados)
// ─────────────────────────────────────────────
app.get("/countries", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/all?fields=name,capital,region,population,flags`);
    res.status(200).json({
      success: true,
      total: response.data.length,
      data: response.data,
    });
  } catch (error) {
    const status = error.response?.status || 500;
    res.status(status).json({
      success: false,
      message: "Error al obtener los países",
      detail: error.message,
    });
  }
});

// ─────────────────────────────────────────────
// GET /countries/name/:name — Busca país por nombre
// ─────────────────────────────────────────────
app.get("/countries/name/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const response = await axios.get(`${BASE_URL}/name/${name}`);
    res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    const status = error.response?.status || 500;
    res.status(status).json({
      success: false,
      message: `No se encontró el país: "${name}"`,
      detail: error.message,
    });
  }
});

// ─────────────────────────────────────────────
// GET /countries/region/:region — Filtra por región
// ─────────────────────────────────────────────
app.get("/countries/region/:region", async (req, res) => {
  const { region } = req.params;
  try {
    const response = await axios.get(`${BASE_URL}/region/${region}?fields=name,capital,population,flags`);
    res.status(200).json({
      success: true,
      region,
      total: response.data.length,
      data: response.data,
    });
  } catch (error) {
    const status = error.response?.status || 500;
    res.status(status).json({
      success: false,
      message: `No se encontró la región: "${region}"`,
      detail: error.message,
    });
  }
});

// ─────────────────────────────────────────────
// POST /countries/search — Búsqueda avanzada por múltiples criterios
// Body: { "names": ["colombia", "peru", "chile"] }
// ─────────────────────────────────────────────
app.post("/countries/search", async (req, res) => {
  const { names } = req.body;

  // Validación de entrada
  if (!names || !Array.isArray(names) || names.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'El campo "names" es requerido y debe ser un arreglo no vacío.',
      example: { names: ["colombia", "peru", "chile"] },
    });
  }

  try {
    // Consulta paralela para todos los nombres enviados
    const promises = names.map((name) =>
  axios.get(`${BASE_URL}/name/${name}`).catch((err) => {
    console.error(`Error buscando "${name}":`, err.message);
    return null;
  })
);

    const results = await Promise.all(promises);

    const found = [];
    const notFound = [];

    results.forEach((result, index) => {
      if (result) {
        found.push(...result.data);
      } else {
        notFound.push(names[index]);
      }
    });

    res.status(200).json({
      success: true,
      searched: names.length,
      found: found.length,
      notFound,
      data: found,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error interno en la búsqueda",
      detail: error.message,
    });
  }
});

// ─────────────────────────────────────────────
// Ruta no encontrada
// ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.path}`,
  });
});

// ─────────────────────────────────────────────
// Iniciar servidor
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📌 Endpoints disponibles:`);
  console.log(`   GET  /countries`);
  console.log(`   GET  /countries/name/:name`);
  console.log(`   GET  /countries/region/:region`);
  console.log(`   POST /countries/search`);
});
