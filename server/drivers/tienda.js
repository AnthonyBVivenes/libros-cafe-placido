const ShoppingModel = require('../models/tienda');

const productosModel = require('../models/categorias');

const actionsModel = require('../models/actions.js');
const actionsController = require('../drivers/actions.js');
const { isnotBodyEmpty } = require('../utils/functions');



//actionsController.getProductosFav


exports.get_tiendaPage = async (req, res) => {
    try {
        const queryParams = req.query || {};
        const pagina = parseInt(queryParams.pagina) || 1;
        const porPagina = 30;

        const isSearchMode = Object.keys(queryParams).length > 0 && !queryParams.pagina;

        // Datos base para la vista
        const user_ = req.session.user ? req.session.user : null;
        const baseData = {
            user: user_,
            queryParams: queryParams
        };

        if (isSearchMode) {
            console.log('[tienda] Modo búsqueda activado');
            return res.render('shop', {
                ...baseData,
                productos: []
            });
        }

        const { productos, total, paginasTotales, paginaActual } = await ShoppingModel.getProductosTienda(
            pagina,
            porPagina,
            {}
        );

        const productosConImagenes = productos.map(producto => ({
            ...producto,
            imagenPrincipal: `/uploads/productos/${JSON.parse(producto.imagenes)[0]}.jpg` || '/uploads/productos/default.jpg'
        }));

        res.render('shop', {
            ...baseData,
            productos: productosConImagenes,
            paginacion: {
                total,
                paginasTotales,
                paginaActual,
                hasPrev: pagina > 1,
                hasNext: pagina < paginasTotales
            }
        });

    } catch (error) {
        console.error('Error en get_tiendaPage:', error);
        res.status(500).render('error', {
            message: "Error al cargar la tienda"
        });
    }
};






exports.get_categoria = async (req, res) => {
    console.log('[categorias]');
    try {
        const queryParams = req.query || {};
        const pagina = parseInt(queryParams.pagina) || 1;
        const porPagina = 30;

        // Obtener el ID de categoría de los parámetros de consulta
        const categoriaId = req.params.categoria || null;

        // Datos base para la vista
        const user_ = req.session.user ? req.session.user : null;
        const baseData = {
            user: user_,
            queryParams: {}
        };
        console.log(categoriaId);

        const { productos, total, paginasTotales, paginaActual } = await ShoppingModel.getProductosFiltrados(
            pagina,
            porPagina,
            {
                categoria: categoriaId ? categoriaId.toString() : null // Convertir a string
            }
        );

        const productosConImagenes = productos.map(producto => ({
            ...producto,
            imagenPrincipal: `/uploads/productos/${JSON.parse(producto.imagenes)[0]}.jpg` || '/uploads/productos/default.jpg'
        }));

        res.render('shop', {
            ...baseData,
            productos: productosConImagenes,
            paginacion: {
                total,
                paginasTotales,
                paginaActual,
                hasPrev: pagina > 1,
                hasNext: pagina < paginasTotales
            }
        });

    } catch (error) {
        console.error('Error en get_tiendaPage:', error);
        res.status(500).render('error', {
            message: "Error al cargar la tienda"
        });
    }
};


exports.get_favoritos = async (req, res) => {
    console.log('[favoritos]');
    try {
        const queryParams = req.query || {};
        const pagina = parseInt(queryParams.pagina) || 1;
        const porPagina = 30;

        // Datos base para la vista
        const user_ = req.session.user ? req.session.user : null;
        const baseData = {
            user: user_,
            queryParams: queryParams,
            tipoDeTexto: 'categorias'
        };

        // Obtener productos favoritos
        const favoritosResponse = await actionsController.getProductosFav( req.session.user.id);
        
        // Si getProductosFav ya envió una respuesta, salir
        if (res.headersSent) return;

        // Extraer y aplanar los productos de la estructura anidada
        let productos = [];
        if (favoritosResponse && favoritosResponse.productosDATA) {
            // Aplanar el array de arrays
            productos = favoritosResponse.productosDATA.flat();
        }

        console.log('Productos favoritos encontrados:', productos.length);

        const productosConImagenes = productos.map(producto => ({
            ...producto,
            imagenPrincipal: `/uploads/productos/${JSON.parse(producto.imagenes)[0]}.jpg` || '/uploads/productos/default.jpg',
            // Parsear otros campos JSON si es necesario
            colores: JSON.parse(producto.color),
            marcas: JSON.parse(producto.Marca)
        }));

        res.render('shop', {
            ...baseData,
            productos: productosConImagenes,
            paginacion: {
                total: productos.length,
                paginasTotales: Math.ceil(productos.length / porPagina),
                paginaActual: pagina,
                hasPrev: pagina > 1,
                hasNext: pagina < Math.ceil(productos.length / porPagina)
            },
            esFavoritos: true // Bandera para identificar que es página de favoritos
        });

    } catch (error) {
        console.error('Error en get_favoritos:', error);
        res.status(500).render('error', {
            message: "Error al cargar los productos favoritos"
        });
    }
};