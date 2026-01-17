const productoController = require('../models/productos.js');
const comprasModels = require('../models/compras.js');






exports.get_pedidoData = async (idCliente) => {
    try {
        console.log('[Getting pedido] .....');
        const pedido= await comprasModels.get_Pedido(idCliente);
        console.log('[get_pedidoData]',pedido);
        return pedido;

    } catch (error) {
        console.error('Error en get_pedidData:', error);
        return {
            message: "No disponible"
        };
    }
};






