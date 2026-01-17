const { isnotBodyEmpty } = require('../utils/functions.js');
const productController = require('../drivers/productos.js');
const categoriasModels = require('../models/categorias.js');
const carritoController = require('../drivers/carrito.js');
const productoModels = require('../models/productos.js');
const comprasModels = require('../models/compras.js');

const adminController = require('../models/administracion.js');
const { getDolar } = require('./tasas.js');



const config = require('../config/loadconfig.js');



exports.confirmacion = async (req, res) => {
    try {
        const user = req.session.user ? req.session.user : null;
        if (!req.session.user) {
            console.log('[confirmacion] > home : idU ', req.session.user.nombre);
            return res.render('index', { user: null });
        }

        return res.render('confirmacion-pago', {
            user: user
        });
    } catch (error) {
        //res.status(500).json({ error: 'Error en el servidor' });
        console.log('[car error]', error);
        return res.render('index', { user: null });
    }
};





exports.details = async (req, res) => {
    try {
        const { user } = req.session;
        const { id } = req.params;

        // 1. Validar que el ID existe
        if (!id) {
            console.log('[details] ID no proporcionado');
            return res.redirect('/'); // Redirigir en lugar de solo return
        }

        // 2. Validar producto
        const validation = await productController.isvalid(id);
        console.log('[details] Validación:', validation.message);

        if (validation.message !== 'valido') {
            console.log('[details] Producto inválido, redirigiendo...');
            return res.redirect('/productos'); // Redirigir a lista de productos
        }

        // 3. Obtener datos del producto
        const producto = await categoriasModels.get_producto(id);

        if (!producto || producto.length === 0) {
            console.log('[details] Producto no encontrado');
            return res.redirect('/tienda');
        }

        console.log('[details] Datos producto:', producto[0]);

        console.log((parseFloat(producto[0].precio) ));
        // 4. Renderizar vista
        return res.render('detail', {
            user: user || null,
            url: '/',
            producto: {
                ...producto[0], // Spread de todas las propiedades originales
                precioBs: (parseFloat(producto[0].precio) * parseFloat(config.getDolar())).toFixed(2) // Precio calculado en $
            },
            codigo: id
        });

    } catch (error) {
        console.error('[details] Error:', error);
        // Enviar error a cliente en desarrollo, redirigir en producción
        if (process.env.NODE_ENV === 'development') {
            return res.status(500).render('error', {
                error: error.message,
                user: req.session.user || null
            });
        } else {
            return res.redirect('/');
        }
    }
};






exports.pagar = async (req, res) => {
    try {
        const user = req.session.user ? req.session.user : null;
        if (!req.session.user) {
            console.log('[pago]', req.session.user.nombre);
            return res.render('index', { user: null });
        }




        const pedido = await carritoController.get_pedidoData(req.session.user.id);
        if (pedido.success == false) {
            console.log(user, "No tiene pedido");
            return res.render('index', { user });
        }

        const productos = pedido.productos;
        const ids = productos.map(producto => producto.idProducto);
        const cantidades = productos.map(producto => producto.cantidad);
        console.log(ids, cantidades);

        let listaDetallada = [];
        for (let i = 0; i < ids.length; i++) {
            const producto = await productoModels.Get_productoLitleInfo(ids[i]);

            // Si el producto no se encuentra, salta esta iteración
            if (!producto) {
                console.error(`Producto con ID ${ids[i]} no encontrado.`);
                continue;
            }

            const r = {
                nombre: producto.nombre,
                precio: producto.precio,
                imagenes: JSON.parse(producto.imagenes),
                cantidad: cantidades[i], // <-- CORRECCIÓN: Usa el índice del bucle
                estado: producto.estado,
            }

            console.log('dddddddd r= ', r);
            listaDetallada.push(r);
        }

        console.log(listaDetallada);

        return res.render('checkout', {
            user,
            productos: listaDetallada,
            total: pedido.pedidoDATA.total,
            totalBs: parseFloat(pedido.pedidoDATA.total) * config.getDolar(),
        });
    } catch (error) {
        return res.render('index', { user: null });
    }
};





exports.carrito = async (req, res) => {
    try {
        const user = req.session.user ? req.session.user : null;
        if (!req.session.user) {
            console.log('[carrito] > home : idU ', req.session);
            return res.render('index', { user: null });
        }


        const pedido = await carritoController.get_pedidoData(req.session.user.id);


        if (pedido.success == false) {
            console.log(user, "No tiene pedido");
            return res.render('cart', { user });
        }

        const productos = pedido.productos;
        const ids = productos.map(producto => producto.idProducto);
        const cantidades = productos.map(producto => producto.cantidad);
        console.log(ids, cantidades);

        let listaDetallada = [];
        for (let i = 0; i < ids.length; i++) {
            const producto = await productoModels.Get_productoLitleInfo(ids[i]);

            // Si el producto no se encuentra, salta esta iteración
            if (!producto) {
                console.error(`Producto con ID ${ids[i]} no encontrado.`);
                continue;
            }

            const r = {
                nombre: producto.nombre,
                precio: producto.precio,
                precioBs: producto.precio*config.getDolar(),
                imagenes: JSON.parse(producto.imagenes),
                cantidad: cantidades[i], // <-- CORRECCIÓN: Usa el índice del bucle
                estado: producto.estado,
                codigo: producto.codigo,
                total:producto.precio*cantidades[i],
                totalBs:producto.precio*cantidades[i]*config.getDolar()
            }

            console.log('dddddddd r= ', r);
            listaDetallada.push(r);
        }

        console.log(listaDetallada);

        return res.render('cart',
            {
                user,
                productos: listaDetallada,
                total: pedido.pedidoDATA.total,
                totalBs: parseFloat(pedido.pedidoDATA.total) * config.getDolar(),
            }
        );
    } catch (error) {
        //res.status(500).json({ error: 'Error en el servidor' });
        console.log('[car error]', error);
        return res.render('index', { user: null });
    }
};





exports.home = async (req, res) => {
    try {
        const user = req.session.user ? req.session.user : null;
        const credenciales = req.session.user.credenciales ? req.session.user.credenciales : null;
        if (req.session.user) {
            console.log('[home]', req.session.user.nombre);
        }

        if (await adminController.getValid_acceso(req.session.user.id) == "admin") {
            console.log('admin home', req.session.user.credenciales);
        }
        const acc = 88;
        console.log("[Verificacion de user]", user);
        return res.render(
            'index',
            {
                user: user
            }
        );
    } catch (error) {
        //res.status(500).json({ error: 'Error en el servidor' });
        return res.render('index', { user: null });
    }
};



exports.contacto = async (req, res) => {
    try {
        const user = req.session.user ? req.session.user : null;
        if (req.session.user) {
            console.log('[home]', req.session.user.nombre);
        }

        return res.render('contact', { user });
    } catch (error) {
        //res.status(500).json({ error: 'Error en el servidor' });
        return res.render('index', { user: null });
    }
};


exports.historial = async (req, res) => {
    try {
        // 1. Validación de sesión de usuario
        if (!req.session?.user?.id) {
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.status(401).json({
                    success: false,
                    message: 'Debes iniciar sesión'
                });
            }
            return res.redirect('/login');
        }

        // 2. Obtener ID del usuario de la sesión
        const userId = req.session.user.id;

        // 3. Llamar al modelo
        const result = await comprasModels.getAllPedidosByUser(userId);
        console.log('[resulttt]=> ', result);
        // 4. Si es una petición AJAX/API, responder con JSON
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.status(200).json(result);
        }

        // 5. Para renderizado EJS
        res.render('historial', {
            pedidos: result.pedidos,
            success: result.success,
            message: result.message,
            user: req.session.user,
            title: 'Mis Pedidos'
        });

    } catch (error) {
        console.error('Error en getAllPedidosUser:', error);

        // Manejo de errores para AJAX
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }

        // Manejo de errores para vistas EJS
        res.render('historial', {
            pedidos: [],
            success: false,
            message: 'Error al cargar los pedidos',
            user: req.session.user,
            title: 'Error - Mis Pedidos'
        });
    }
};
