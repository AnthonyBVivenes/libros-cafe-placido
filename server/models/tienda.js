const { pool, poolMongo } = require('../config/db.js');



class Shopping {

    static async getProductosTienda(pagina = 1, porPagina = 30, filtros = {}) {
        try {
            const [resultados] = await pool.query(
                'CALL Get_productosPaginados(?, ?, ?, ?, ?)',
                [
                    pagina,
                    porPagina,
                    filtros.categoria || null,
                    filtros.precioMax || null,
                    filtros.orden || 'recientes'
                ]
            );

            return {
                productos: resultados[0],
                total: resultados[1][0].total,
                paginasTotales: Math.ceil(resultados[1][0].total / porPagina),
                paginaActual: pagina
            };
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }



 static async getProductosFiltrados(pagina, porPagina, filtros = {}) {
    try {
        console.log('[En categoria]',filtros.categoria);
        const [results] = await pool.query('CALL Get_productosPaginados(?, ?, ?, ?, ?)', [
            pagina,
            porPagina,
            filtros.categoria || null,
            filtros.precio_max || null,
            filtros.orden || 'recientes'
        ]);

        // results[0] = productos paginados
        // results[1] = total de productos
        console.log('resul 0  ', results[0]);
        return {
            productos: results[0],
            total: results[1][0].total,
            paginasTotales: Math.ceil(results[1][0].total / porPagina),
            paginaActual: pagina
        };
        
    } catch (error) {
        console.error('Error en getProductosFiltrados:', error);
        throw error;
    }
}

static async getCategoriasActivas() {
    try {
        const [results] = await pool.query('SELECT * FROM categorias WHERE estado = 1 ORDER BY nombre');
        return results;
    } catch (error) {
        console.error('Error en getCategoriasActivas:', error);
        return [];
    }
}





 static async getProductosFavoritosFiltrados(pagina, porPagina, filtros = {}) {
    try {
        console.log('[En categoria]',filtros.categoria);
        const [results] = await pool.query('CALL Get_productosPaginados(?, ?, ?, ?, ?)', [
            pagina,
            porPagina,
            filtros.categoria || null,
            filtros.precio_max || null,
            filtros.orden || 'recientes'
        ]);

        // results[0] = productos paginados
        // results[1] = total de productos
        console.log('resul 0  ', results[0]);
        return {
            productos: results[0],
            total: results[1][0].total,
            paginasTotales: Math.ceil(results[1][0].total / porPagina),
            paginaActual: pagina
        };
        
    } catch (error) {
        console.error('Error en getProductosFiltrados:', error);
        throw error;
    }
}








}

module.exports = Shopping;