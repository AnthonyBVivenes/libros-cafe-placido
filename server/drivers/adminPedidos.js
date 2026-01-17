// Crea un nuevo archivo: drivers/adminPedidos.js

const comprasModels = require('../models/compras.js');
const { ObjectId } = require('mongodb');
const productModels = require('../models/productos.js');

exports.getPedidosAdmin = async (req, res) => {
    try {
        if (!req.session.user ) {
            return res.status(403).json({
                success: false,
                message: 'Acceso no autorizado'
            });
        }

        const { estado = 'todos', busqueda = '', pagina = 1, limite = 30 } = req.query;

        const result = await comprasModels.getAllPedidosAdmin({
            estado: estado !== 'todos' ? estado : undefined,
            busqueda: busqueda.trim(),
            pagina: parseInt(pagina),
            limite: parseInt(limite)
        });

        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.json(result);
        }

        res.render('admin/pedidos', {
            pedidos: result.pedidos,
            total: result.total,
            pagina: result.pagina,
            totalPaginas: result.totalPaginas,
            filtros: { estado, busqueda },
            user: req.session.user
        });

    } catch (error) {
        console.error('Error en getPedidosAdmin:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

exports.getDetallePedido = async (req, res) => {
    try {
        if (!req.session.user ) {
            return res.status(403).json({
                success: false,
                message: 'Acceso no autorizado'
            });
        }

        const { id } = req.params;

        const result = await comprasModels.getPedidoById(id);

        if (!result.success) {
            return res.status(404).json(result);
        }

        // Obtener información detallada de productos
        const productosConInfo = await Promise.all(
            result.pedido.productos.map(async (producto) => {
                const productoInfo = await productModels.Get_productoLitleInfo(producto.idProducto);
                return {
                    ...producto,
                    nombre: productoInfo?.nombre || 'Producto no encontrado',
                    imagenes: productoInfo?.imagenes ? JSON.parse(productoInfo.imagenes) : []
                };
            })
        );

        res.json({
            success: true,
            pedido: {
                ...result.pedido,
                productos: productosConInfo
            }
        });

    } catch (error) {
        console.error('Error en getDetallePedido:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

exports.actualizarEstado = async (req, res) => {
    try {
        if (!req.session.user ) {
            return res.status(403).json({
                success: false,
                message: 'Acceso no autorizado'
            });
        }

        const { id } = req.params;
        const { estado } = req.body;

        const estadosPermitidos = ['nuevo', 'completado', 'No pagado', 'en proceso', 'enviado', 'entregado', 'cancelado'];
        
        if (!estadosPermitidos.includes(estado)) {
            return res.status(400).json({
                success: false,
                message: 'Estado no válido'
            });
        }

        const result = await comprasModels.actualizarEstadoPedido(id, estado);

        res.json(result);

    } catch (error) {
        console.error('Error en actualizarEstado:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};