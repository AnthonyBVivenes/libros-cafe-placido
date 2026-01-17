const express = require('express');
const router = express.Router();

const productController = require('../drivers/productos');
const loginController = require('../drivers/login');
const entradasController = require('../drivers/entradas');

const buscadorController = require('../drivers/buscador')

const actionsController = require('../drivers/actions');


const comprasController = require('../drivers/compras');

const adminController = require('../drivers/administracion');

const mainController = require('../drivers/pages');

const config = require('../config/loadconfig');




// GET /categories
router.get('/categories', productController.getAll_categorias);

router.get('/categoriasData', productController.getAll_categoriasData);


router.get('/entradas/:id', async (req, res) => {
    try {
        const entradaId = req.params.id;

        if (!entradaId) {
            return res.status(400).json({
                error: 'ID de entrada no proporcionado',
                details: 'Debe especificar un ID en la URL (/entradas/1)'
            });
        }

        // Validar que el ID sea numérico
        if (isNaN(entradaId)) {
            return res.status(400).json({
                error: 'ID inválido',
                details: 'El ID debe ser un número'
            });
        }

        const entrada = await entradasController.get_entrada(entradaId);

        if (!entrada) {
            return res.status(404).json({
                error: 'Entrada no encontrada',
                details: `No existe una entrada con el ID ${entradaId}`
            });
        }

        return res.status(200).json(entrada); // Asegúrate de usar return aquí

    } catch (error) {
        console.error('Error en GET /entradas/:id:', error);

        return res.status(500).json({
            error: 'Error al obtener la entrada',
            details: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
});



//++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PRODUDUCTOS

router.get('/destacados', async (req, res) => {
    try {
        const configId = req.params.id;
        /*
                // Validar que el ID de configuración sea proporcionado
                if (!configId) {
                    return res.status(400).json({ 
                        error: 'ID de configuración no proporcionado',
                        details: 'Debe especificar un ID en la URL (/productos/destacados/1)'
                    });
                }
        
                // Validar que el ID sea numérico
                if (isNaN(configId)) {
                    return res.status(400).json({ 
                        error: 'ID inválido',
                        details: 'El ID debe ser un número'
                    });
                }
        */
        // Obtener los productos destacados
        const productos = await productController.getData_productosDestacados(config.productos.destacados, res); // No se deben pasar req y res aquí

        // Verificar si se obtuvieron productos
        if (!productos || productos.length === 0) {
            return res.status(404).json({
                error: 'No se encontraron productos destacados',
                details: `No existen productos destacados para la configuración con ID ${configId}`
            });
        }

        return res.status(200).json(productos); // Devolver los productos destacados

    } catch (error) {
        console.error('Error en GET /productos/destacados/:id:', error);

        return res.status(500).json({
            error: 'Error al obtener productos destacados',
            details: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
});

router.get('/producto', productController.get_producto);
router.post('/producto', productController.get_producto);


router.post('/update', productController.update_producto);



router.get('/producto/detail', productController.get_productoDetails);
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++





// POST /signup
router.post('/signup', async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Cuerpo de solicitud vacío' });
        }

        const { email, password, nombre } = req.body;

        if (!email || !password || !nombre) {
            return res.status(400).json({
                error: 'Faltan campos requeridos',
                missing: {
                    email: !email,
                    password: !password,
                    nombre: !nombre
                }
            });
        }

        const result = await loginController.createUser(email, password, nombre);
        res.status(201).json(result);

    } catch (error) {
        console.error('Error en /signup:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email ya registrado' });
        }

        res.status(500).json({ message: 'Error en el servidor' });
    }
});


// POST /login
router.post('/login', loginController.loginUser);


router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Error al cerrar sesión' });
        }
        return res.redirect('/'); 
    });
});

router.get('/perfil', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'No autenticado' });
    }
    res.json({ user: req.session.user.id });
});


router.get('/recient', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'No autenticado' });
    }
    res.json({ user: req.session.user });
});


router.post('/pedido/detail', productController.get_productoDetails);



//+++++++++++++++++++++++++++++++++++++++++++++++++++++++
// tienda

router.post('/pedidos/agregar-producto',comprasController.aggProductoPedido);


//Users ops

router.post('/fav', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            error: 'No autenticado',
            message: 'Debes iniciar sesión para acceder a esta sección'
        });
    }
    return actionsController.postProductoFav(req, res);
    //res.json({ user: req.session.user });
});



router.get('/fav',actionsController.getProductosFav);


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//registro

router.get('/registrarse', async (req, res) => {
    // Aquí puedes ejecutar cualquier función Node.js que necesites
    //await miFuncionDeNode(); // tu función personalizada
    console.log("rrrrrrrrrrrrrr");
    // Luego envías el archivo HTML
    res.sendFile(require('path').join(__dirname, '../../public/Register.html'));
});
///////////////////////////////////////////////////////////////










//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                       COMPRAS

router.post('/aggProd', async (req, res) => {

    comprasController.post_comprar(req, res);
});


router.post('/reduceProd', async (req, res) => {

    comprasController.reducirProductoPedido(req, res);
});


///////////////////////////////////////////////////////////////






router.post('/buscar/', buscadorController.getSearch);











//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                       Admin api


router.post('/administracion/productos', adminController.crearProducto);
router.get('/administracion/productosView', adminController.getProductos);

router.post('/administracion/eliminarProducto', adminController.deleteProducto);

///////////////////////////////////////////////////////////////












/////////////////////////////////////////////////////////////////////////
//                         PAGOS


router.post('/procesar-pago', comprasController.finalizarCompra);

router.post('/procesar-pago-ref', comprasController.reFinalizarCompra);

// routes/compras.js

////////////////////////////////////////////////////////////////////////









router.post('/pedido/id',comprasController.getPedidoId);






module.exports = router;