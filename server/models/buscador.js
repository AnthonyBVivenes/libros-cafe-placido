
const {pool} = require('../config/db.js');

class Buscar {


  static async getSearch(txt) {
    try {
      const [results] = await pool.query('call GetSearch_productos(?);', [txt]);

      // El procedimiento almacenado devuelve los resultados en el primer conjunto
      
      console.log(results[0])
      return results[0];
      
    } catch (error) {
      //console.error('Error en Category.getAllActive:', error);
      throw new Error('Error al obtener categorías');
    }
  }










}

module.exports = Buscar;