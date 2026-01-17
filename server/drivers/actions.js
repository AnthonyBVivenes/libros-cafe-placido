const actions = require('../models/actions.js');




const productosModel = require('../models/categorias.js');
const { isnotBodyEmpty } = require('../utils/functions');




exports.postProductoFav = async (req, res) => {
    try {
        if (isnotBodyEmpty(req, res)) {
            const idp = req.body.idProducto;
            const result = await actions.post_aggProdFav(idp, req.session.user.id);
            if (result.success) {
                res.status(200).json({ message: result.message });
            }
            else {
                res.status(400).json({ message: 'No se pudo añadir el producto a favoritos.' });
            }
        }

    } catch (error) {
        console.error('Error en postProductoFav:', error);
        //throw error;
        res.status(500).json({ message: 'Error al añadir el producto a favoritos.' });
    }
};






exports.getProductosFav = async (id) => {
    try {


        const result = await actions.getCantidadFavoritos(id);

        let productos = []; // Inicializar como array vacío

        for (let i = 0; i < result.favs.length; i++) {
            console.log(`Índice ${i}: ${result.favs[i]}`);

            // Obtener el producto y agregarlo al array
            const producto = await productosModel.get_producto(result.favs[i]);

            // Verificar si el producto existe antes de agregarlo
            if (producto) {
                productos.push(producto);
                console.log(`✅ Producto agregado: ${producto.nombre || result.favs[i]}`);
            } else {
                console.log(`❌ Producto no encontrado: ${result.favs[i]}`);
            }
        }

        console.log('Array final de productos:', productos);

        if (result.success) {
            return {
                message: result.message,
                cantidad: result.count,
                favs: result.favs,
                productosDATA: productos
            };
        }
        else {
            return {
                message: result.message,
                cantidad: result.count
            };
        }

    } catch (error) {
        console.error('Error en postProductoFav:', error);
        //throw error;
        return {
                message: 'Error obtener el productos favoritos.',
                success: false
            }
        ;
    }
};











