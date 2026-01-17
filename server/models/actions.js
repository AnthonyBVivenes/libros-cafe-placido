const { pool, poolMongo } = require('../config/db.js');

class user {





    static async post_aggProdFav(idp, idu) {
        let db;
        try {
            // Validación básica de parámetros
            if (!idp || !idu) {
                return {
                    success: false,
                    message: 'Datos de entrada incompletos',
                    errorCode: 'INVALID_INPUT'
                };
            }

            db = await poolMongo();
            const collection = db.collection('fav');

            // 1. Verificar si el producto ya está en favoritos
            const usuarioConFavorito = await collection.findOne({
                idUsuario: idu,
                idProductos: idp
            });

            let operation;
            let isFavorite;

            if (usuarioConFavorito) {
                // 2. Eliminar de favoritos si ya existe
                const resultado = await collection.updateOne(
                    { idUsuario: idu },
                    { $pull: { idProductos: idp } }
                );

                operation = 'removed';
                isFavorite = false;
                console.log(`Producto ${idp} eliminado de favoritos del usuario ${idu}`);
            } else {
                // 3. Agregar a favoritos si no existe
                const resultado = await collection.updateOne(
                    { idUsuario: idu },
                    { $addToSet: { idProductos: idp } },
                    { upsert: true }
                );

                operation = resultado.upsertedCount > 0 ? 'created_and_added' : 'added';
                isFavorite = true;
                console.log(`Producto ${idp} ${operation === 'created_and_added' ? 'añadido a nuevo documento' : 'añadido a favoritos'} para usuario ${idu}`);
            }

            return {
                success: true,
                operation: operation,
                isFavorite: isFavorite,
                message: isFavorite ? 'Producto añadido a favoritos' : 'Producto eliminado de favoritos'
            };

        } catch (error) {
            console.error('Error en post_aggProdFav:', error);

            // Clasificación de errores
            let errorMessage = 'Error al procesar la solicitud';
            let errorCode = 'SERVER_ERROR';

            if (error.code === 11000) {
                errorMessage = 'Error de duplicado en la base de datos';
                errorCode = 'DUPLICATE_KEY';
            } else if (error.name === 'MongoNetworkError') {
                errorMessage = 'Problema de conexión con la base de datos';
                errorCode = 'DB_CONNECTION_ERROR';
            }

            return {
                success: false,
                message: errorMessage,
                errorCode: errorCode
            };
        } finally {
            if (db && db.client) {
                await db.client.close();
            }
        }
    }


    static async getCantidadFavoritos(idu) {
    try {
        console.log('ids ', idu);
        if (!idu) return [];

        const db = await poolMongo();
        const collection = db.collection('fav');

        const usuarioFavoritos = await collection.findOne({
            idUsuario: idu
        });
        const ids = usuarioFavoritos ? usuarioFavoritos.idProductos : [];
console.log(usuarioFavoritos);
        return {
            success: true,
            cantidad: ids.length,
            message: 'Se encontraron tus productos favoritos',
            favs:usuarioFavoritos ? usuarioFavoritos.idProductos : []
        }
        

    } catch (error) {
        console.error('Error en getFavoritosIdsSimple:', error);
        return [];
    }
}



}

module.exports = user;