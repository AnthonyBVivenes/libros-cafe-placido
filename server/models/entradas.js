
const {pool} = require('../config/db.js');

class Entradas {




  static async get_entrada(n_entrada) {
    console.log('getAll_CategoriasData');
    try {
            const [results] = await pool.query('CALL Get_entrada(?)', [n_entrada]);
            
            // El procedimiento almacenado devuelve los resultados en el primer conjunto
            return results[0]; 
        } catch (error) {
            console.error('Error en Category.getAllActive:', error);
            throw new Error('Error al obtener categorías');
        }
  }



}

module.exports = Entradas;