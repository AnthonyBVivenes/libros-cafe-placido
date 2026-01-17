
const { pool } = require('../config/db.js');

class Product {


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




  static async get_productosDestacados(id) {
    //call db_commence.Get_productos_destacado(1);
    try {
      const [results] = await pool.query('CALL Get_productos_destacado(?)', [id]);
      //console.log('get_productosDestacados', results);
      //console.log('get_productosDestacados', results);
      // Accede a la cadena JSON dentro de productosDestacados
      const productosDestacadosString = results[0][0].productosDestacados;
      // Asegúrate de que productosDestacadosString sea una cadena JSON válida
      const arrayy = JSON.parse(productosDestacadosString);
      //console.log('Array de productos destacados:', arrayy);

      // El procedimiento almacenado devuelve los resultados en el primer conjunto
      //console.log("arra" ,arrayy,5);
      return arrayy;
    } catch (error) {
      console.error('call db_commence.Get_productos_destacado();', error);
      throw new Error('Error al obtener categorías');
    }
  }

  static async get_producto(id) {
    //call db_commence.Get_productos_destacado(1);
    try {
      const [results] = await pool.query('CALL Get_producto(?)', [id]);
      //console.log('get_producto   -', id, " - ", results);
      // El procedimiento almacenado devuelve los resultados en el primer conjunto
      return results[0];
    } catch (error) {
      console.error('call db_commence.Get_producto();', error);
      throw new Error('Error al obtener categorías');
    }
  }

  static async get_productoIsValid(id) {

    try {
      const [results] = await pool.query('CALL GetValid_producto(?)', [id]);
      console.log('get_producto   -', id, " - ", results[0][0]);
      // El procedimiento almacenado devuelve los resultados en el primer conjunto
      return results[0][0];
    } catch (error) {
      console.error('call db_commence.GetValid_producto();', error);
      throw new Error('get_productoIsValid Error ');
    }
  }

  /*
    static async getById(id) {
      const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
      return rows[0];
    }
  
    static async create({ name, price, description }) {
      const [result] = await pool.query(
        'INSERT INTO products (name, price, description) VALUES (?, ?, ?)',
        [name, price, description]
      );
      return { id: result.insertId, name, price, description };
    }
  */

  static async aumentarCantidadProducto(cod, cantidad) {
    try {
      const [results] = await pool.query('CALL Aumentar_cantidadProducto(?, ?)', [cod, cantidad]);

      if (results.affectedRows > 0) {
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







static async Update_producto(datosActualizados) {
    try {
        const [results] = await pool.query('CALL ActualizarProducto(?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            datosActualizados.id,
            datosActualizados.nombre,
            datosActualizados.descripcion,
            datosActualizados.precio,
            datosActualizados.precioOriginal,
            datosActualizados.cantidad,
            datosActualizados.estado,
            datosActualizados.peso,
            JSON.stringify(datosActualizados.Marca)
        ]);

        console.log('Update_producto - Éxito:', results);
        return { success: true, message: 'Producto actualizado con éxito.' };
    } catch (error) {
        console.error('Error al llamar al procedimiento ActualizarProducto:', error);
        return {
          success: false
        };
        throw new Error('Update_producto Error: ' + error.message);
    }
}




static async create_categoria(data) {
    const { nombre, estado = 0, img_default = 0 } = data;

    try {
        // Usar una conexión para manejar el parámetro OUT
        const connection = await pool.getConnection();
        
        // Primero establecer la variable de salida
        await connection.query('SET @id_generado = 0;');
        
        // Llamar al procedimiento con el parámetro OUT
        const [results] = await connection.query(
            'CALL New_categoria(?, ?, ?, @id_generado);',
            [nombre, estado, img_default]
        );
        
        // Obtener el valor del parámetro OUT
        const [idResult] = await connection.query('SELECT @id_generado as id;');
        const idGenerado = idResult[0].id;
        
        console.log('create_categoria -', nombre, " - ID:", idGenerado);
        
        // Liberar la conexión
        connection.release();
        
        return idGenerado;
        
    } catch (error) {
        console.error('call New_categoria();', error);
        throw new Error('create_categoria Error ');
    }
}









}



module.exports = Product;