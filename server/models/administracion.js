
const { pool } = require('../config/db.js');

const { isnotBodyEmpty } = require('../utils/functions');











class ProductoIdGenerator {
    static contador = 0;
    static ultimoMinuto = null;

    static generarProductoId() {
        if (!this.contador) {
            this.contador = 0;
            this.ultimoMinuto = new Date().getMinutes();
        }
        
        const ahora = new Date();
        const minutoActual = ahora.getMinutes();
        
        // Reiniciar contador si cambió el minuto
        if (minutoActual !== this.ultimoMinuto) {
            this.contador = 0;
            this.ultimoMinuto = minutoActual;
        }
        
        this.contador++;
        
        return `${ahora.getFullYear()}${String(ahora.getMonth() + 1).padStart(2, '0')}${String(ahora.getDate()).padStart(2, '0')}${String(ahora.getHours()).padStart(2, '0')}${String(minutoActual).padStart(2, '0')}${this.contador}`;
    }
}

// USO:
//=const id = ProductoIdGenerator.generarProductoId();




class administracion {


    static async getValid_acceso(id) {
        console.log('//GetValid_admin');
        try {
            const [results] = await pool.query('CALL GetValid_admin(?)', id);

            console.log("[Accediendo]", results[0][0].acceso);

            return results[0][0].acceso;

        } catch (error) {
            console.error('Error en CGetValid_admin:', error);
            return res.json({ message: "error" });
        }
    }


    


    static async crearProducto(productoData) {
        try {
            const [result] = await pool.query(
                'CALL Post_new_producto(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @codigo, @mensaje)',
                [
                    productoData.nombre,
                    productoData.descripcion,
                    productoData.precio,
                    productoData.imagenes, // Ahora acepta el string JSON directamente
                    productoData.estado,
                    productoData.cantidad,
                    productoData.peso,
                    productoData.talla,
                    productoData.categorias,
                    productoData.marca,
                    (ProductoIdGenerator.generarProductoId())
                ]
            );

            const [output] = await pool.query('SELECT @codigo AS codigo, @mensaje AS mensaje');
            
            return output[0];
        } catch (error) {
            console.error('Error en crearProducto:', error);
            throw error;
        }
    }




    static async deleteProducto(id,res) {
        console.log('//deleteProducto');
        try {
            const [results] = await pool.query('CALL Delete_producto(?)', id);

            console.log("[Resultado eliminacion (Models)]", results[0][0].message);
            if (results[0][0].message == 'valido'){
                return "Producto elimando";
            }
            return results[0][0].message;

        } catch (error) {
            console.error('Error en deleteProducto:', error);
            return res.json({ message: "error" });
        }
    }

}

module.exports = administracion;