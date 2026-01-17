
const { pool, poolMongo } = require('../config/db.js');

const { isnotBodyEmpty } = require('../utils/functions');


class reportes {


    static async getReportes() {
        try {
            const [results] = await pool.query('CALL GetReport_stockBajo()');

            // El procedimiento almacenado devuelve los resultados en el primer conjunto
            return results[0];
        } catch (error) {
            console.error('Error en re.GetReport_stockBajo:', error);
            throw new Error('Error al obtener GetReport_stockBajo');
        }
    }




    static async getReporteMes() {
        let db;
        try {
            db = await poolMongo();
            const collection = db.collection('pedidos');

            // Get the date 30 days ago
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            // Change findOne to find and add toArray()
            const r = await collection.find({
                fechaFinalizacion: {
                    $gte: thirtyDaysAgo
                }

            }).toArray();

            console.log("mes", r);

            // This function should return the array of documents
            // so you can use it to build your report.
            return r;

        } catch (error) {
            console.error('Error en getReporteMes:', error);

            // Always return an empty array in case of an error
            return [];

        } finally {
            if (db && db.client) {
                await db.client.close();
            }
        }
    }



    static async getReporteDia() {
        let db;
        try {
            db = await poolMongo();
            const collection = db.collection('pedidos');

            // === CORRECCIÓN AQUI ===
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0); // Establece la hora a 00:00:00.000

            const startOfTomorrow = new Date(startOfToday);
            startOfTomorrow.setDate(startOfTomorrow.getDate() + 1); // Avanza al día siguiente
            // =======================

            const r = await collection.find({
                fechaFinalizacion: {
                    $gte: startOfToday,
                    $lt: startOfTomorrow
                }
            }).toArray();

            console.log("Día", r);

            return r;

        } catch (error) {
            console.error('Error en getReporteDia:', error);
            return [];
        } finally {
            if (db && db.client) {
                await db.client.close();
            }
        }
    }








}

module.exports = reportes;