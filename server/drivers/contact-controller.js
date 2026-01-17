const contactoModel = require('../models/contact.js');
const { isnotBodyEmpty } = require('../utils/functions');

/**
 * Endpoint para recibir y guardar un mensaje de contacto.
 * @param {object} req - Objeto de la solicitud HTTP.
 * @param {object} res - Objeto de la respuesta HTTP.
 */
exports.postContact = async (req, res) => {
    console.log('33');
    try {
        if (!isnotBodyEmpty(req, res)) {
            return; // La función isnotBodyEmpty ya maneja la respuesta
        }

        const { name, email, subject, message } = req.body;

        const result = await contactoModel.postMensaje(name, email, subject, message);

        if (result.success) {
            res.status(200).json({ message: result.message, id: result.insertedId });
        } else {
            res.status(400).json({ message: result.message, errorCode: result.errorCode });
        }

    } catch (error) {
        console.error('Error en postContact:', error);
        res.status(500).json({ message: 'Error interno del servidor al procesar el contacto.' });
    }
};







exports.getMessages = async (req, res) => {
    try {
        // Llama a la función del modelo para obtener los mensajes
        const mensajes = await contactoModel.getMensajes();
        
        // Si todo sale bien, envía los mensajes en formato JSON
        res.status(200).json(mensajes);
    } catch (error) {
        console.error('Error en getMessages:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener los mensajes.' });
    }
};



