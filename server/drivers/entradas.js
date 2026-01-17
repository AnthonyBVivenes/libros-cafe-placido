// drivers/entradas.js
const Entradasmodels = require('../models/entradas');

exports.get_entrada = async (id) => {
  try {
    return await Entradasmodels.get_entrada(id);
  } catch (error) {
    console.error('Error en get_entrada:', error);
    throw error; // Propaga el error para que lo maneje el router
  }
};
