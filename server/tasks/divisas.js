// tareasProgramadas.js
const cron = require('node-cron');

const tasasController= require('../drivers/tasas.js');

const config = require('../config/loadconfig.js');

class TareasProgramadas {
    static async tareaPrincipal() {
        console.log('✅ Ejecutando tarea programada:', new Date().toLocaleString());
        await tasasController.getDolar();
        console.log('[Get config global] ',config.getDolar());
        // Aquí va tu lógica principal
    }

    static alIniciarServidor() {
        console.log('🚀 Ejecutando tareas al iniciar servidor');
        this.tareaPrincipal();
    }

    static configurarTareas() {
        // Tarea cada 60 minutos
        cron.schedule('*/30 * * * *', () => {
            console.log('⏰ Tarea programada ');
            this.tareaPrincipal();
        });

        console.log('📅 Tareas programadas configuradas');
    }
}

module.exports = TareasProgramadas;