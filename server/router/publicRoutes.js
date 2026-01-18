const express = require('express');
const path = require('path');
const router = express.Router();




const actionsController = require('../drivers/administracion');
const tiendaController = require('../drivers/tienda');

const mainController = require('../drivers/pages');

const adminPedidosController = require('../drivers/adminPedidos.js');


const reportController= require('../drivers/reporte.js');

const tasasController = require('../drivers/tasas.js');
const productosController = require('../drivers/productos.js');

// Rutas de administración
router.get('/admin/pedidos', adminPedidosController.getPedidosAdmin);
router.get('/admin/pedidos/:id', adminPedidosController.getDetallePedido);
router.put('/admin/pedidos/:id/estado', adminPedidosController.actualizarEstado);
//////////////////////////////////////

router.get(['/','/index.html','/index','/home','/index.php'], mainController.home);


router.get(['/shop.html', '/tienda', '/tienda.html'], tiendaController.get_tiendaPage);

router.get(['/shop.html/:categoria', '/tienda/:categoria', '/tienda.html/:categoria'], tiendaController.get_categoria);


router.get(['/contact.html','/contacto'],mainController.contacto);
router.get(['/cart.html','/carrito'],mainController.carrito);
router.get(['/checkout.html','/pagar'],mainController.pagar);
router.get(['/historial.html','/historial'],mainController.historial);
//href="checkout.html"

router.get(['/producto/:id', '/product/:id', '/detail/:id', '/details/:id'], mainController.details);


router.post(['/admin/pdf/reportes'],reportController.get_report);
router.post(['/admin/pdf/reportesView'],reportController.get_reportView);
router.get(['/confirmacion-pago'],mainController.confirmacion);

const publicPath = path.join(__dirname, '../../public');





router.get('/registrarse', (req, res) => {

    if (!req.session.user) {
        //return res.status(401).json({ error: 'No autenticado' });
        //res.sendFile(path.join(publicPath, 'registrarse.html'));

        return res.sendFile(path.join(publicPath, 'registrarse.html'));
    } else {
        mainController.home(req, res);
        return;
    }
    //res.json({ user: req.session.user });

    //return res.status(401).json({ error: 'Sección activa' });
    res.sendFile(path.join(publicPath, 'index.html'));
    // Aquí puedes ejecutar lógica Node si lo necesitas
});


router.get('/login', (req, res) => {

    if (!req.session.user) {
        //return res.status(401).json({ error: 'No autenticado' });
        //res.sendFile(path.join(publicPath, 'registrarse.html'));

        return res.sendFile(path.join(publicPath, 'Login.html'));
    }
    //res.json({ user: req.session.user });

    //return res.status(401).json({ error: 'Sección activa' });
    mainController.home(req, res);
        return;
});








router.get('/lacasadelasabiduria/administracion', actionsController.admin);

////////////////////////////////////////
//#############CATEGORIAS###############
router.post('/admin/categorias/agg', productosController.create_categoria);

////////////////////////////////////////

const contactController= require('../drivers/contact-controller.js')
router.post('/contact', contactController.postContact);
router.get('/api/contactos/get', contactController.getMessages);


const actions= require('../drivers/actions.js');
router.get('/p', actions.getProductosFav);
router.get('/tienda/productos/favoritos', tiendaController.get_favoritos);
module.exports = router;