
const https = require('https');
const axios = require('axios');
const cheerio = require('cheerio');

const config = require('../config/loadconfig')

// Configurar axios para ignorar certificados SSL
const agent = new https.Agent({  
    rejectUnauthorized: false
});

exports.getDolar = async () => {
    try {
        const url = 'https://www.bcv.org.ve/';
        
        const response = await axios.get(url, {
            httpsAgent: agent,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        const $ = cheerio.load(response.data);
        let valorDolar = $('#dolar .centrado strong').text().trim();

        valorDolar = valorDolar.replace(',', '.');

        console.log('Valor del dólar:', valorDolar);
        config.actualizarTasaDolar(parseFloat(valorDolar).toFixed(2));
        return valorDolar;
        
    } catch (error) {
        console.error('Error:', error.message);
        return 0;
    }
}

// Ejecutar
//obtenerTasasDeCambio();