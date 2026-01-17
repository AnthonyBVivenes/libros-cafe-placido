const path = require('path');

class ConfigServer {
    constructor() {
        // Configuración fija (privada)
        this._configFija = {
            productos: {
                destacados: 1,
                publicPath: path.join(__dirname, '../../public'),
            }
        };

        // Estado mutable (privado)
        this._estado = {
            dolar: 0,
            ultimaActualizacion: null
        };
    }

    // Métodos para actualizar estado
    actualizarTasaDolar(tasa) {
        this._estado.dolar = tasa;
        this._estado.ultimaActualizacion = new Date();
    }

    // Métodos para leer datos (solo getters)
    getDolar() {
        return this._estado.dolar;
    }

    getUltimaActualizacion() {
        return this._estado.ultimaActualizacion;
    }

    getConfigProductos() {
        return { ...this._configFija.productos }; // Devolvemos copia
    }

    // Método para obtener todo el estado actual
    getEstado() {
        return {
            config: { ...this._configFija },
            estado: { ...this._estado }
        };
    }
}

// Creamos la instancia (NO congelamos)
const configInstance = new ConfigServer();

// Exportamos la instancia
module.exports = configInstance;