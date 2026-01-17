const { poolMongo } = require('../config/db.js');
const { ObjectId } = require('mongodb');

class Contacto {
    
    /**
     * Guarda un nuevo mensaje de contacto en la base de datos.
     * @param {string} name - Nombre del remitente.
     * @param {string} email - Correo del remitente.
     * @param {string} subject - Asunto del mensaje.
     * @param {string} message - Contenido del mensaje.
     * @returns {object} Objeto con el resultado de la operación.
     */
    static async postMensaje(name, email, subject, message) {
        let db;
        try {
            if (!name || !email || !subject || !message) {
                return {
                    success: false,
                    message: 'Datos de entrada incompletos',
                    errorCode: 'INVALID_INPUT'
                };
            }

            db = await poolMongo();
            const collection = db.collection('contactos'); // Nombre de la colección

            const nuevoMensaje = {
                name: name,
                email: email,
                subject: subject,
                message: message,
                receivedAt: new Date()
            };

            const result = await collection.insertOne(nuevoMensaje);

            if (result.acknowledged) {
                return {
                    success: true,
                    message: 'Mensaje guardado con éxito',
                    insertedId: result.insertedId
                };
            } else {
                throw new Error('No se pudo guardar el mensaje.');
            }

        } catch (error) {
            console.error('Error en postMensaje:', error);
            return {
                success: false,
                message: 'Error al guardar el mensaje',
                errorCode: 'DB_SAVE_ERROR'
            };
        }
    }

    // Dentro de la clase Contacto en models/contact.js

static async getMensajes() {
    let db;
    try {
        db = await poolMongo();
        const collection = db.collection('contactos'); // El nombre de la colección debe coincidir
        
        // Busca todos los documentos en la colección 'contactos'
        // y los ordena por fecha de recepción de forma descendente.
        const mensajes = await collection.find().sort({ receivedAt: -1 }).toArray();

        return mensajes;
    } catch (error) {
        console.error('Error en getMensajes:', error);
        return [];
    }
}



}

module.exports = Contacto;