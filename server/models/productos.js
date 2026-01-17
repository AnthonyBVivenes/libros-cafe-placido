
const { pool } = require('../config/db.js');

const { isnotBodyEmpty } = require('../utils/functions');


class Productos {


  static async getAll_Categorias() {
    try {
      const [results] = await pool.query('CALL GetAll_categorias()');

      // El procedimiento almacenado devuelve los resultados en el primer conjunto
      return results[0];
    } catch (error) {
      console.error('Error en Category.getAllActive:', error);
      throw new Error('Error al obtener categorías');
    }
  }


  static async getAll_CategoriasData() {
    console.log('getAll_CategoriasData');
    try {
      const [results] = await pool.query('CALL GetAll_categorias_data()');

      // El procedimiento almacenado devuelve los resultados en el primer conjunto
      return results[0];
    } catch (error) {
      console.error('Error en Category.getAllActive:', error);
      throw new Error('Error al obtener categorías');
    }
  }

  static async get_producto(id) {
    try {

      const [results] = await pool.query('CALL GetSearch_productos(?)', id);
      console.log(results);
      return results;
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  };



  static async Get_productoLitleInfo(id) {
    try {

      const [results] = await pool.query('CALL Get_productoLitleInfo(?)', id);
      console.log('little  ',results[0][0]);
      return results[0][0];
    } catch (error) {
      return { error: 'Error al obtener producto' };
    }
  };

  static async Get_productoPrecio(id) {
    try {

      const [results] = await pool.query('CALL Get_precioProducto(?)', id);
      console.log('little  ',results[0][0]);
      return results[0][0];
    } catch (error) {
      console.log({ error: 'Error al obtener producto' });
      return { error: 'Error al obtener producto' };
    }
  };











static async updateCantidadProducto(cod, cantidad) {
  try {
    const [results] = await pool.query('CALL Upadate_cantidadProducto(?, ?)', [cod, cantidad]);
    
    // Verificar si la actualización fue exitosa
    if (results.affectedRows > 0) {
      console.log(`Producto ${cod} actualizado. Cantidad reducida en: ${cantidad}`);
      return { success: true, message: 'Cantidad actualizada correctamente' };
    } else {
      console.log('No se encontró el producto o no hubo cambios');
      return { success: false, message: 'Producto no encontrado' };
    }
  } catch (error) {
    console.error('Error al actualizar cantidad del producto:', error);
    return { 
      success: false, 
      message: 'Error al actualizar cantidad del producto',
      error: error.message 
    };
  }
}


static async aumentarCantidadProducto(cod, cantidad) {
    try {
        const [results] = await pool.query('CALL Aumentar_cantidadProducto(?, ?)', [cod, cantidad]);
        console.log(results[0]);
        if (results[0][0].affectedRows > 0) {
            console.log(`Producto ${cod} actualizado. Cantidad aumentada en: ${cantidad}`);
            return { success: true, message: 'Cantidad aumentada correctamente' };
        } else {
            console.log('No se encontró el producto o no hubo cambios');
            return { success: false, message: 'Producto no encontrado' };
        }
    } catch (error) {
        console.error('Error al aumentar cantidad del producto:', error);
        return { 
            success: false, 
            message: 'Error al aumentar cantidad del producto',
            error: error.message 
        };
    }
}




}

module.exports = Productos;