const comprasModels = require('../models/compras.js');


const productosController = require('./productos.js');


const { isnotBodyEmpty } = require('../utils/functions');

exports.post_comprar = async (req, res) => {
  try {

    if (!isnotBodyEmpty(req, res)) {
      return;
    }
    // await Entradasmodels.get_entrada(id);
    const r = productosController.isvalid(req.body.id);
    console.log('[isvalid  55]', r);
    if (r == "valido") {

    }

  } catch (error) {
    console.error('Error en get_entrada:', error);
    throw error; // Propaga el error para que lo maneje el router
  }



};

exports.finalizarCompra = async (req, res) => {
    try {
        // 1. Validación de sesión de usuario
        if (!req.session?.user?.id) {
            return res.status(401).json({
                success: false,
                message: 'Debes iniciar sesión para finalizar la compra'
            });
        }

        // 2. Validación del cuerpo de la solicitud
        if (!isnotBodyEmpty(req, res)) {
            return;
        }

        const datosPago = req.body;
        
        // Aquí puedes agregar validaciones adicionales
        //const nuevoPago = new Pago(datosPago);
        //await nuevoPago.save();

        console.log('[PROCESADOR DE PAGOS]Body=>',datosPago);

        // 3. Validar datos obligatorios
        const { nombres, apellidos, cedula, telefono, metodoPago } = req.body;
        
        if (!nombres || !apellidos || !cedula || !telefono || !metodoPago) {
            return res.status(400).json({
                success: false,
                message: 'Faltan datos obligatorios'
            });
        }

        // 4. Obtener datos del usuario
        const userId = req.session.user.id;

        // 5. Llamar al modelo para finalizar el pedido
        const result = await comprasModels.finalizarPedido(userId, req.body);

        // 6. Respuesta exitosa
        return res.status(200).json({
            success: true,
            message: 'Compra finalizada exitosamente',
            data: {
                pedidoId: result.pedidoId
            }
        });

    } catch (error) {
        console.error('Error en finalizarCompra:', error);

        // 7. Manejo de errores específicos
        if (error.message.includes('No hay productos')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        // 8. Error genérico del servidor
        return res.status(500).json({
            success: false,
            message: 'Error interno al procesar la compra',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};



exports.reFinalizarCompra = async (req, res) => {
    try {
        // 1. Validación de sesión de usuario
        if (!req.session?.user?.id) {
            return res.status(401).json({
                success: false,
                message: 'Debes iniciar sesión para finalizar la compra'
            });
        }

        // 2. Validación del cuerpo de la solicitud
        if (!isnotBodyEmpty(req, res)) {
            return;
        }

        const datosPago = req.body;
        
        // Aquí puedes agregar validaciones adicionales
        //const nuevoPago = new Pago(datosPago);
        //await nuevoPago.save();

        console.log('[PROCESADOR DE PAGOS]Body=>',datosPago);


        // 4. Obtener datos del usuario
        const userId = req.session.user.id;

        // 5. Llamar al modelo para finalizar el pedido
        const result = await comprasModels.reFinalizarPedido(userId, req.body,req.body.idPedido);

        // 6. Respuesta exitosa
        return res.status(200).json({
            success: true,
            message: 'Compra finalizada exitosamente',
            data: {
                pedidoId: result.pedidoId
            }
        });

    } catch (error) {
        console.error('Error en finalizarCompra:', error);

        // 7. Manejo de errores específicos
        if (error.message.includes('No hay productos')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        // 8. Error genérico del servidor
        return res.status(500).json({
            success: false,
            message: 'Error interno al procesar la compra',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


exports.reducirProductoPedido = async (req, res) => {
    try {
        if (!req.session?.user?.id) {
            return res.status(401).json({
                success: false,
                message: 'Debes iniciar sesión'
            });
        }

        if (!isnotBodyEmpty(req, res)) return;

        if (!req.body.idProducto || isNaN(Number(req.body.idProducto))) {
            return res.status(400).json({
                success: false,
                message: 'Producto inválido'
            });
        }

        const cantidad = req.body.cantidad ? parseInt(req.body.cantidad) : 1;
        if (isNaN(cantidad) || cantidad < 1) {
            return res.status(400).json({
                success: false,
                message: 'Cantidad inválida'
            });
        }

        const userId = req.session.user.id;
        const productId = parseInt(req.body.idProducto);

        const result = await comprasModels.reducirProducto_Pedido(userId, productId, cantidad);

        return res.status(200).json({
            success: true,
            message: result.operacion === 'eliminado' 
                ? 'Producto eliminado del pedido' 
                : 'Cantidad reducida correctamente',
            data: {
                operation: result.operacion,
                productId,
                nuevaCantidad: result.nuevaCantidad
            }
        });

    } catch (error) {
        console.error('Error en reducirProductoPedido:', error);

        if (error.message.includes('No existe') || error.message.includes('no encontrado') || error.message.includes('No se puede reducir')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Error interno al reducir producto',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


exports.aggProductoPedido = async (req, res) => {
  try {
    // 1. Validación de sesión de usuario
    if (!req.session?.user?.id) {
      return res.status(401).json({
        success: false,
        message: 'Debes iniciar sesión para realizar pedidos'
      });
    }

    // 2. Validación del cuerpo de la solicitud
    if (!isnotBodyEmpty(req, res)) {
      return;
    }

    // 3. Validación del producto
    if (!req.body.idProducto ) {
      return res.status(400).json({
        success: false,
        message: 'Debes seleccionar un producto válido'
      });
    }

    // 4. Validación de cantidad (mínimo 1)
    const cantidad = req.body.cantidad ? parseInt(req.body.cantidad) : 1;
    if (isNaN(cantidad) || cantidad < 1) {
      return res.status(400).json({
        success: false,
        message: 'La cantidad debe ser un número mayor a 0'
      });
    }

    // 5. Obtener datos del usuario y producto
    const userId = req.session.user.id;
    const productId = parseInt(req.body.idProducto);

    const r = await productosController.isvalid(productId);
    console.log('[isvalid]', r);
    if (r.message !== "valido") {
      return res.status(400).json({
        success: false,
        message: 'No es un producto valido'
      });
    }

    // 6. Llamar al modelo
    console.log(userId, productId, cantidad);
    const result = await comprasModels.aggProducto_Pedido(userId, productId, cantidad);

    // 7. Manejar respuesta del modelo
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.operation === 'created'
          ? 'Nuevo pedido creado con el producto'
          : 'Producto agregado al pedido existente',
        data: {
          operation: result.operation,
          productId,
          newQuantity: result.newCount
        }
      });
    }

    // 8. Respuesta cuando no hay cambios
    return res.status(200).json({
      success: true,
      message: 'El producto ya estaba en el pedido',
      data: {
        operation: 'no_changes',
        productId,
        currentQuantity: result.newCount
      }
    });

  } catch (error) {
    console.error('Error en aggProductoPedido:', error);

    // 9. Manejo de errores específicos
    if (error.message.includes('Parámetros inválidos')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    // 10. Error genérico del servidor
    return res.status(500).json({
      success: false,
      message: 'No hay disponibilidad en éstos momentos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getAllPedidosUser = async (req, res) => {
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
        res.render('lista-pedidos', {
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
            user: req.session.user.nombre,
            title: 'Error - Mis Pedidos'
        });
    }
};









exports.getPedidoId = async (req, res) => {
    try {
        // 1. Validación de sesión del usuario
        if (!req.session?.user?.id) {
            return res.status(401).json({
                success: false,
                message: 'Debes iniciar sesión para ver tus pedidos'
            });
        }

        // 2. Validar que el ID del pedido esté presente
        if (!req.body.id) {
            return res.status(400).json({ // Usa 400 Bad Request para datos faltantes
                success: false,
                message: 'ID de pedido no proporcionado'
            });
        }

        // 3. Obtener el ID del usuario de la sesión
        const userId = req.session.user.id;
        
        // 4. Llamar al modelo para obtener el pedido
        const result = await comprasModels.getPedidoId(req.body.id, userId);

        // 5. Responder con el resultado del modelo en formato JSON
        if (result.success) {
            return res.status(200).json(result);
        } else {
            // Si el modelo indica que no hubo éxito (por ejemplo, pedido no encontrado)
            return res.status(404).json(result); // Usa 404 Not Found si no se encuentra el recurso
        }

    } catch (error) {
        console.error('Error en getPedidoId:', error);

        // Manejo de errores para responder con JSON en caso de excepción
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al procesar tu solicitud.'
        });
    }
};