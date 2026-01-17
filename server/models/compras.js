const { pool, poolMongo } = require('../config/db.js');
const productModels = require('../models/productos.js');
const { ObjectId } = require('mongodb');

class buy {

    static async finalizarPedido(userId, datosPago) {
        try {
            const db = await poolMongo();
            const collection = db.collection('pedidos');

            // Obtener el pedido actual
            const pedido = await collection.findOne({
                idUsuario: userId,
                estado: 'nuevo'
            });

            if (!pedido || !pedido.productos || pedido.productos.length === 0) {
                throw new Error('No hay productos en el pedido');
            }

            // Actualizar el pedido con los datos de pago y cambiar estado
            const resultado = await collection.updateOne(
                {
                    idUsuario: userId,
                    estado: 'nuevo'
                },
                {
                    $set: {
                        estado: 'En espera',
                        datosPago: datosPago,
                        fechaFinalizacion: new Date(),
                        metodoPago: datosPago.metodoPago
                    }
                }
            );

            if (resultado.modifiedCount === 0) {
                throw new Error('No se pudo actualizar el pedido');
            }

            return {
                success: true,
                message: 'Pedido completado exitosamente',
                pedidoId: pedido._id
            };

        } catch (error) {
            console.error('Error en finalizarPedido:', error);
            throw new Error(`Error al finalizar pedido: ${error.message}`);
        }
    }


    static async reFinalizarPedido(userId, datosPago, idPedido) {
        try {
            const db = await poolMongo();
            const collection = db.collection('pedidos');

            // Obtener el pedido actual
            const pedido = await collection.findOne({
                _id: new ObjectId(idPedido),
                idUsuario: userId
            });
            console.log('[repedido-REFENCIAS]', idPedido, '  /n', pedido);

            if (!pedido || !pedido.productos || pedido.productos.length === 0) {
                throw new Error('No hay productos en el pedido');
            }

            // Actualizar el pedido con los datos de pago y cambiar estado
            const resultado = await collection.updateOne(
                {
                    idUsuario: userId,
                    estado: 'No pagado'
                },
                {
                    $set: {
                        estado: 'En espera',
                        'datosPago.referencia': datosPago.referencia,
                        fechaFinalizacion: new Date(),
                        metodoPago: datosPago.metodoPago
                    }
                }
            );

            if (resultado.modifiedCount === 0) {
                throw new Error('No se pudo actualizar el pedido');
            }

            return {
                success: true,
                message: 'Pedido completado exitosamente',
                pedidoId: pedido._id
            };

        } catch (error) {
            console.error('Error en finalizarPedido:', error);
            throw new Error(`Error al finalizar pedido: ${error.message}`);
        }
    }



    static async aggProducto_Pedido(userId, cod = 0, cantidad = 1) {
        try {
            const productoInfo = await productModels.Get_productoPrecio(cod);

            if (!productoInfo || productoInfo.error) {
                throw new Error('Producto no encontrado');
            }

            if (productoInfo.estado !== 1) {
                throw new Error('Producto no disponible');
            }

            const db = await poolMongo();
            const collection = db.collection('pedidos');

            const pedidoExistente = await collection.findOne({
                idUsuario: userId,
                estado: 'nuevo'
            });

            let cantidadExistente = 0;
            if (pedidoExistente && pedidoExistente.productos) {
                const productoEnPedido = pedidoExistente.productos.find(p => p.idProducto === cod);
                cantidadExistente = productoEnPedido ? productoEnPedido.cantidad : 0;
            }

            const cantidadTotalSolicitada = cantidadExistente + cantidad;

            if (cantidad > productoInfo.cantidad) {

                throw new Error(`Solo hay ${productoInfo.cantidad} unidades disponibles`);
            }

            const precioUnitario = productoInfo.precio;
            const incrementoTotal = cantidad * precioUnitario;

            if (cantidadExistente > 0) {
                await collection.updateOne(
                    {
                        idUsuario: userId,
                        estado: 'nuevo',
                        "productos.idProducto": cod
                    },
                    {
                        $inc: {
                            "productos.$.cantidad": cantidad,
                            "total": incrementoTotal
                        },
                        $set: {
                            "productos.$.precioUnitario": precioUnitario,
                            "productos.$.fechaActualizacion": new Date()
                        }
                    }
                );
            } else {
                await collection.updateOne(
                    {
                        idUsuario: userId,
                        estado: 'nuevo'
                    },
                    {
                        $push: {
                            productos: {
                                idProducto: cod,
                                cantidad: cantidad,
                                precioUnitario: precioUnitario,
                                fechaAgregado: new Date()
                            }
                        },
                        $inc: { "total": incrementoTotal },
                        $setOnInsert: {
                            fechaCreacion: new Date(),
                            estado: 'nuevo',
                            idUsuario: userId
                        }
                    },
                    {
                        upsert: true
                    }
                );
            }

            const stockResult = await productModels.updateCantidadProducto(cod, cantidad);
            if (!stockResult.success) {
                throw new Error(stockResult.message);
            }

            return { success: true };

        } catch (error) {
            console.error('Error en aggProducto_Pedido:', error);
            throw new Error(`No hay disponibilidad en éstos momentos ${error.message}`);
        }
    }

    static async get_Pedido(userId) {
        let db;
        try {
            if (!userId) {
                return {
                    success: false,
                    productos: [],
                    message: 'ID de usuario es requerido'
                };
            }

            db = await poolMongo();
            const collection = db.collection('pedidos');

            const pedido = await collection.findOne({
                idUsuario: userId,
                estado: 'nuevo'
            });

            if (!pedido || !pedido.productos) {
                return {
                    success: true,
                    productos: [],
                    total: 0,
                    message: 'No hay productos en el pedido'
                };
            }
            console.log("[GET PEDIDO] DATOS =", pedido);

            const productos = pedido.productos.map(p => ({
                idProducto: p.idProducto,
                cantidad: p.cantidad || 1,
                precioUnitario: p.precioUnitario || 0
            }));

            return {
                success: true,
                productos: productos,
                total: pedido.total || 0,
                message: `Productos obtenidos correctamente`,
                pedidoDATA: pedido
            };

        } catch (error) {
            console.error('Error en obtenerIdsYCantidades:', error);
            return {
                success: false,
                productos: [],
                total: 0,
                message: 'Error al obtener productos'
            };
        } finally {
            if (db?.client) {
                await db.client.close();
            }
        }
    }

    static async reducirProducto_Pedido(userId, cod = 0, cantidadReducir = 1) {
        try {
            const db = await poolMongo();
            const collection = db.collection('pedidos');

            const pedidoExistente = await collection.findOne({
                idUsuario: userId,
                estado: 'nuevo'
            });

            if (!pedidoExistente || !pedidoExistente.productos) {
                throw new Error('No existe pedido o productos');
            }

            const productoEnPedido = pedidoExistente.productos.find(p => p.idProducto === cod);
            if (!productoEnPedido) {
                throw new Error('Producto no encontrado en el pedido');
            }

            const cantidadActual = productoEnPedido.cantidad;
            const nuevaCantidad = cantidadActual - cantidadReducir;

            if (nuevaCantidad < 0) {
                throw new Error('No se puede reducir más de la cantidad existente');
            }

            const precioUnitario = productoEnPedido.precioUnitario || 0;
            const decrementoTotal = cantidadReducir * precioUnitario;

            if (nuevaCantidad === 0) {
                await collection.updateOne(
                    {
                        idUsuario: userId,
                        estado: 'nuevo'
                    },
                    {
                        $pull: { productos: { idProducto: cod } },
                        $inc: { total: -decrementoTotal }
                    }
                );
            } else {
                await collection.updateOne(
                    {
                        idUsuario: userId,
                        estado: 'nuevo',
                        "productos.idProducto": cod
                    },
                    {
                        $set: {
                            "productos.$.cantidad": nuevaCantidad,
                            "productos.$.fechaActualizacion": new Date()
                        },
                        $inc: { total: -decrementoTotal }
                    }
                );
            }

            const stockResult = await productModels.aumentarCantidadProducto(cod, cantidadReducir);
            if (!stockResult.success) {
                throw new Error(stockResult.message);
            }

            return {
                success: true,
                nuevaCantidad: nuevaCantidad,
                operacion: nuevaCantidad === 0 ? 'eliminado' : 'reducido'
            };

        } catch (error) {
            console.error('Error en reducirProducto_Pedido:', error);
            throw new Error(`Error al reducir producto: ${error.message}`);
        }
    }



    static async getHistorialPedidos(userId) {
        let db;
        try {
            if (!userId) {
                return {
                    success: false,
                    pedidos: [],
                    message: 'ID de usuario es requerido'
                };
            }

            db = await poolMongo();
            const collection = db.collection('pedidos');

            // Obtener todos los pedidos del usuario excepto los "nuevos"
            const pedidos = await collection.find({
                idUsuario: userId,
                estado: { $ne: 'nuevo' }
            }).sort({ fechaFinalizacion: -1 }).toArray();

            if (!pedidos || pedidos.length === 0) {
                return {
                    success: true,
                    pedidos: [],
                    message: 'No hay historial de pedidos'
                };
            }

            // Formatear los datos para la vista
            const pedidosFormateados = pedidos.map(pedido => ({
                id: pedido._id,
                fecha: pedido.fechaFinalizacion ? new Date(pedido.fechaFinalizacion).toLocaleDateString() : 'No especificada',
                estado: pedido.estado || 'completado',
                total: pedido.total || 0,
                productos: pedido.productos ? pedido.productos.length : 0,
                nota: `Pedido #${pedido._id.toString().substring(0, 8)}` // Nota corta con ID
            }));

            return {
                success: true,
                pedidos: pedidosFormateados,
                message: `Historial obtenido correctamente`
            };

        } catch (error) {
            console.error('Error en getHistorialPedidos:', error);
            return {
                success: false,
                pedidos: [],
                message: 'Error al obtener historial de pedidos'
            };
        } finally {
            if (db?.client) {
                await db.client.close();
            }
        }
    }


    static async getAllPedidosByUser(userId) {
        let db;
        try {
            if (!userId) {
                return {
                    success: false,
                    pedidos: [],
                    message: 'ID de usuario es requerido'
                };
            }

            db = await poolMongo();
            const collection = db.collection('pedidos');

            // Obtener TODOS los pedidos del usuario, ordenados por fecha descendente
            const pedidos = await collection.find({
                idUsuario: userId
            }).sort({ fechaCreacion: -1 }).toArray();

            if (!pedidos || pedidos.length === 0) {
                return {
                    success: true,
                    pedidos: [],
                    message: 'No hay pedidos para este usuario'
                };
            }

            // Formatear los datos para la vista
            const pedidosFormateados = pedidos.map(pedido => ({
                _id: pedido._id,
                idUsuario: pedido.idUsuario,
                estado: pedido.estado || 'nuevo',
                total: pedido.total || 0,
                productos: pedido.productos || [],
                fechaCreacion: pedido.fechaCreacion || new Date(),
                fechaFinalizacion: pedido.fechaFinalizacion || null,
                datosPago: pedido.datosPago || {},
                cantidadProductos: pedido.productos ? pedido.productos.length : 0,
                fechaFormateada: pedido.fechaCreacion ?
                    new Date(pedido.fechaCreacion).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : 'Fecha no disponible'
            }));
            console.log('[pedidp formateados] =>', pedidosFormateados)
            return {
                success: true,
                pedidos: pedidosFormateados,
                message: `Se encontraron ${pedidos.length} pedidos`
            };

        } catch (error) {
            console.error('Error en getAllPedidosByUser:', error);
            return {
                success: false,
                pedidos: [],
                message: 'Error al obtener los pedidos'
            };
        } finally {
            if (db?.client) {
                await db.client.close();
            }
        }
    }












    static async getPedidoId(idPedido, idUser) {
        let db;
        try {
            if (!idPedido || !idUser) {
                return {
                    success: false,
                    message: 'ID de pedido o de usuario no proporcionado'
                };
            }

            db = await poolMongo();
            const collection = db.collection('pedidos');

            // Convierte el idPedido a un ObjectId y busca el documento
            const pedido = await collection.findOne({
                _id: new ObjectId(idPedido),
                idUsuario: idUser
            });

            if (!pedido) {
                return {
                    success: false,
                    message: 'No se encontró el pedido o no pertenece al usuario'
                };
            }

            // Obtener la información completa de cada producto usando el método Get_productoLitleInfo
            // Mapeamos el array de productos para crear un array de promesas

            console.log("pedido.productos \n ", pedido.productos, "\n");

            const promesasProductos = pedido.productos.map(producto =>
                productModels.Get_productoLitleInfo(producto.idProducto) // Asumimos que el id del producto está en producto.id
            );



            // Esperamos a que todas las promesas se resuelvan
            const productosCompletos = await Promise.all(promesasProductos);

            // Combina la información original con los detalles completos
            const productosConDetalles = pedido.productos.map((producto, index) => {
                // Busca los detalles completos en el array de productosCompletos
                const detalles = productosCompletos[index];

                // Crea un nuevo objeto que combine el producto original con los detalles completos
                return {
                    ...producto, // Copia todas las propiedades del producto original
                    detalles: detalles // Agrega un nuevo campo 'detalles'
                };
            });

            // Ahora, asigna este nuevo array a la propiedad productos del pedido
            pedido.productos = productosConDetalles;

            // Formatear el documento para la vista
            const pedidoFormateado = {
                // ... (resto de tus campos de formateo)
                ...pedido,
                cantidadProductos: pedido.productos ? pedido.productos.length : 0,
                fechaFormateada: pedido.fechaCreacion ?
                    new Date(pedido.fechaCreacion).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : 'Fecha no disponible'
            };

            return {
                success: true,
                pedido: pedidoFormateado,
                message: 'Pedido encontrado'
            };

        } catch (error) {
            console.error('Error en getPedidoId:', error);
            return {
                success: false,
                message: 'Error al obtener el pedido'
            };
        } finally {
            if (db?.client) {
                await db.client.close();
            }
        }
    }




















    /////////////////////////////////////
    //pedidos

    // En models/compras.js

    static async getAllPedidosAdmin(filtros = {}) {
        let db;
        try {
            db = await poolMongo();
            const collection = db.collection('pedidos');

            // Construir query basado en filtros
            let query = {};

            if (filtros.estado && filtros.estado !== 'todos') {
                query.estado = filtros.estado;
            }

            if (filtros.busqueda) {
                query.$or = [
                    { 'datosPago.nombres': { $regex: filtros.busqueda, $options: 'i' } },
                    { 'datosPago.apellidos': { $regex: filtros.busqueda, $options: 'i' } },
                    { 'datosPago.cedula': { $regex: filtros.busqueda, $options: 'i' } }
                ];
            }

            const page = filtros.pagina || 1;
            const limit = filtros.limite || 30;
            const skip = (page - 1) * limit;

            const pedidos = await collection.find(query)
                .sort({ fechaCreacion: -1 })
                .skip(skip)
                .limit(limit)
                .toArray();

            const total = await collection.countDocuments(query);

            return {
                success: true,
                pedidos: pedidos,
                total: total,
                pagina: page,
                totalPaginas: Math.ceil(total / limit)
            };

        } catch (error) {
            console.error('Error en getAllPedidosAdmin:', error);
            return {
                success: false,
                pedidos: [],
                message: 'Error al obtener pedidos'
            };
        } finally {
        }
    }

    static async getPedidoById(idPedido) {
        let db;
        try {
            if (!ObjectId.isValid(idPedido)) {
                return {
                    success: false,
                    message: 'ID de pedido inválido'
                };
            }

            db = await poolMongo();
            const collection = db.collection('pedidos');

            const pedido = await collection.findOne({
                _id: new ObjectId(idPedido)
            });

            if (!pedido) {
                return {
                    success: false,
                    message: 'Pedido no encontrado'
                };
            }

            return {
                success: true,
                pedido: pedido
            };

        } catch (error) {
            console.error('Error en getPedidoById:', error);
            return {
                success: false,
                message: 'Error al obtener pedido'
            };
        } finally {
        }
    }

    static async actualizarEstadoPedido(idPedido, nuevoEstado) {
        let db;
        try {
            if (!ObjectId.isValid(idPedido)) {
                return {
                    success: false,
                    message: 'ID de pedido inválido'
                };
            }

            db = await poolMongo();
            const collection = db.collection('pedidos');

            const resultado = await collection.updateOne(
                { _id: new ObjectId(idPedido) },
                {
                    $set: {
                        estado: nuevoEstado,
                        fechaActualizacion: new Date()
                    }
                }
            );

            if (resultado.modifiedCount === 0) {
                return {
                    success: false,
                    message: 'No se pudo actualizar el pedido'
                };
            }

            return {
                success: true,
                message: 'Estado actualizado correctamente'
            };

        } catch (error) {
            console.error('Error en actualizarEstadoPedido:', error);
            return {
                success: false,
                message: 'Error al actualizar estado'
            };
        } finally {
            return;
        }
    }

}

module.exports = buy;