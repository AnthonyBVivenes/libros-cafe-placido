const fs = require('fs');
const { getFechaHora3Segundos } = require('../utils/functions.js');
const reportModels = require('../models/report.js');
const puppeteer = require('puppeteer');




// Agrega esta función auxiliar para convertir imágenes a base64
function imageToBase64(imagePath) {
    try {
        const imageBuffer = fs.readFileSync(imagePath);
        return `data:image/${imagePath.split('.').pop()};base64,${imageBuffer.toString('base64')}`;
    } catch (error) {
        console.error('Error al cargar la imagen:', error);
        return null;
    }
}



async function generatePDFBuffer(htmlContent) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
            top: '20px',
            right: '20px',
            bottom: '20px',
            left: '20px'
        }
    });

    await browser.close();
    return pdfBuffer;
}




// Función para generar el HTML base de los reportes
function generarHTMLReporte(titulo, contenidoTabla) {
    let imagenHTML = '';
    const imagenBase64=imageToBase64('./server/reportes/encabezado.jpg');
    if (imagenBase64) {
        imagenHTML = `
        <div style="text-align: center; margin-bottom: 15px;">
            <img src="${imagenBase64}" alt="Logo" style="max-width: 100%; ">
        </div>`;
    }

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${titulo}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                h1 { color: #333; text-align: center; margin-bottom: 10px; }
                .header { text-align: center; margin-bottom: 20px; }
                .date { color: #666; font-size: 14px; }
                th { background-color: #f2f2f2; padding: 12px; border: 1px solid #ddd; }
                td { padding: 8px; border: 1px solid #ddd; }
                .stock-bajo { background-color: #ffcccc; }
                .stock-normal { background-color: #ffffff; }
            </style>
        </head>
        <body>
            <div class="header">
                ${imagenHTML}
                <h1>${titulo}</h1>
                <p class="date">Generado el: ${new Date().toLocaleString('es-ES')}</p>
            </div>
            ${contenidoTabla}
        </body>
        </html>`;
}


function generarHTMLReporteView(titulo, contenidoTabla, imagenBase64 = null) {
    let imagenHTML = '';

        imagenHTML = `
        <div style="text-align: center; margin-bottom: 15px;">
            <img src="/encabezado.jpg" alt="Logo" style="max-width: 100%;">
        </div>`;
    

    return `
            <style>
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                h1 { color: #333; text-align: center; margin-bottom: 10px; }
                .header { text-align: center; margin-bottom: 20px; }
                .date { color: #666; font-size: 14px; }
                th { background-color: #f2f2f2; padding: 12px; border: 1px solid #ddd; }
                td { padding: 8px; border: 1px solid #ddd; }
                .stock-bajo { background-color: #ffcccc; }
                .stock-normal { background-color: #ffffff; }
            </style>
        
            <div class="header">
                ${imagenHTML}
                <h1>${titulo}</h1>
                <p class="date">Generado el: ${new Date().toLocaleString('es-ES')}</p>
            </div>
            ${contenidoTabla}
            `;
}

exports.get_report = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado',
                error: "Acceso no autorizado"
            });
        }

        console.log('[Getting report] .....');
        let finalHTML = '';
        let reportName = '';

        // MENÚ SWITCH PARA DIFERENTES TIPOS DE REPORTE
        switch (req.body.tipo) {

            case 'Ventas del dia':
                console.log('Generando reporte de Ventas del día');
                // EJEMPLO PARA REPORTE DE VENTAS
                const ventasDia = await reportModels.getReporteDia();

                const encabezadoVentasDia = `
                    <table>
                        <thead>
                            <tr>
                                <th>Ci cliente</th>
                                <th>Hora</th>
                                <th>Método de pago</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>`;

                let filasVentasDia = '';
                let totalGeneralDia = 0;
                console.log('cccccccccc   ', ventasDia);
                ventasDia.forEach(venta => {
                    totalGeneralDia += parseFloat(venta.total || 0);
                    //const fechaYHora = `${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})}`;
                    filasVentasDia += `
                        <tr>
                            <td>${venta.datosPago.cedula}</td>
                            <td>${venta.fechaFinalizacion.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true })}</td>
                            <td>${venta.metodoPago}</td>
                            <td>$${parseFloat(venta.total).toFixed(2)}</td>
                        </tr>`;
                });

                // Pie de tabla con total general
                filasVentasDia += `
                    <tr style="background-color: #e6f7ff; font-weight: bold;">
                        <td colspan="3" style="text-align: right;">Total General:</td>
                        <td>$${totalGeneralDia.toFixed(2)}</td>
                        <td></td>
                    </tr>`;

                const tablaVentasDia = encabezadoVentasDia + filasVentasDia + '</tbody></table>';
                finalHTML = generarHTMLReporte('Reporte de Ventas del Día', tablaVentasDia);
                reportName = `Reporte_Ventas_Del día_${getFechaHora3Segundos()}.pdf`;
                break;


            case 'Stock bajo':
                console.log('Generando reporte de Stock bajo');
                const data = await reportModels.getReportes();

                const encabezado = `
                    <table>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Cantidad</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>`;

                let filas = '';
                data.forEach(row => {
                    const esStockBajo = row.cantidad < 10;
                    const claseFila = esStockBajo ? 'class="stock-bajo"' : 'class="stock-normal"';
                    const estado = esStockBajo ? 'STOCK BAJO' : 'Normal';

                    filas += `
                        <tr ${claseFila}>
                            <td>${row.codigo}</td>
                            <td>${row.nombre}</td>
                            <td>${row.precio}</td>
                            <td>${row.cantidad}</td>
                            <td>${estado}</td>
                        </tr>`;
                });

                const tabla = encabezado + filas + '</tbody></table>';
                finalHTML = generarHTMLReporte('Reporte de Stock Bajo', tabla);
                reportName = `Reporte_Stock_Bajo_${getFechaHora3Segundos()}.pdf`;
                break;

            case 'Productos inactivos':
                console.log('Generando reporte de Productos inactivos');
                // EJEMPLO PARA OTRO TIPO DE REPORTE
                const productosInactivos = await reportModels.getProductosInactivos();

                const encabezadoInactivos = `
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Última actualización</th>
                                <th>Razón</th>
                            </tr>
                        </thead>
                        <tbody>`;

                let filasInactivos = '';
                productosInactivos.forEach(producto => {
                    filasInactivos += `
                        <tr class="stock-bajo">
                            <td>${producto.id}</td>
                            <td>${producto.nombre}</td>
                            <td>${producto.ultima_actualizacion}</td>
                            <td>${producto.razon || 'Sin especificar'}</td>
                        </tr>`;
                });

                const tablaInactivos = encabezadoInactivos + filasInactivos + '</tbody></table>';
                finalHTML = generarHTMLReporte('Reporte de Productos Inactivos', tablaInactivos);
                reportName = `Reporte_Productos_Inactivos_${getFechaHora3Segundos()}.pdf`;
                break;

            case 'Ventas del mes':
                console.log('Generando reporte de Ventas del mes');
                // EJEMPLO PARA REPORTE DE VENTAS
                const ventas = await reportModels.getReporteMes();

                const encabezadoVentas = `
                    <table>
                        <thead>
                            <tr>
                                <th>Ci cliente</th>
                                <th>fechaFinalizacion</th>
                                <th>Método de pago</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>`;

                let filasVentas = '';
                let totalGeneral = 0;
                console.log('cccccccccc   ', ventas);
                ventas.forEach(venta => {
                    totalGeneral += parseFloat(venta.total || 0);
                    //const fechaYHora = `${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})}`;
                    filasVentas += `
                        <tr>
                            <td>${venta.datosPago.cedula}</td>
                            <td>${venta.fechaFinalizacion.toLocaleDateString('es-ES')}</td>
                            <td>${venta.metodoPago}</td>
                            <td>$${parseFloat(venta.total).toFixed(2)}</td>
                        </tr>`;
                });

                // Pie de tabla con total general
                filasVentas += `
                    <tr style="background-color: #e6f7ff; font-weight: bold;">
                        <td colspan="3" style="text-align: right;">Total General:</td>
                        <td>$${totalGeneral.toFixed(2)}</td>
                        <td></td>
                    </tr>`;

                const tablaVentas = encabezadoVentas + filasVentas + '</tbody></table>';
                finalHTML = generarHTMLReporte('Reporte de Ventas del Mes', tablaVentas);
                reportName = `Reporte_Ventas_Mes_${getFechaHora3Segundos()}.pdf`;
                break;

            case '0': // Productos desactivados
                console.log('Generando reporte de Productos desactivados');
                const productosDesactivados = await reportModels.getProductosDesactivados();

                // ... lógica similar para este reporte ...
                finalHTML = generarHTMLReporte('Productos Desactivados', '<p>Reporte en desarrollo...</p>');
                reportName = `Reporte_Desactivados_${getFechaHora3Segundos()}.pdf`;
                break;

            default:
                return res.status(400).json({
                    success: false,
                    message: 'Tipo de reporte no válido',
                    error: "Tipo no soportado",
                    tipos_disponibles: [
                        'Stock bajo',
                        'Productos inactivos',
                        'Ventas del mes',
                        '0' // Productos desactivados
                    ]
                });
        }

        // Generar el PDF en memoria (buffer)
        const pdfBuffer = await generatePDFBuffer(finalHTML);

        // Configurar headers para descarga
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${reportName}"`);
        res.setHeader('Content-Length', pdfBuffer.length);

        // Enviar el PDF como respuesta
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error en reports:', error);
        res.status(500).json({
            success: false,
            message: 'Error al generar el reporte',
            error: error.message
        });
    }
};

















exports.get_reportView = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado',
                error: "Acceso no autorizado"
            });
        }

        console.log('[Getting report] .....');
        let finalHTML = '';
        let reportName = '';

        // MENÚ SWITCH PARA DIFERENTES TIPOS DE REPORTE
        switch (req.body.tipo) {

            case 'Ventas del dia':
                console.log('Generando reporte de Ventas del día');
                // EJEMPLO PARA REPORTE DE VENTAS
                const ventasDia = await reportModels.getReporteDia();

                const encabezadoVentasDia = `
                    <table>
                        <thead>
                            <tr>
                                <th>Ci cliente</th>
                                <th>Hora</th>
                                <th>Método de pago</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>`;

                let filasVentasDia = '';
                let totalGeneralDia = 0;
                console.log('cccccccccc   ', ventasDia);
                ventasDia.forEach(venta => {
                    totalGeneralDia += parseFloat(venta.total || 0);
                    //const fechaYHora = `${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})}`;
                    filasVentasDia += `
                        <tr>
                            <td>${venta.datosPago.cedula}</td>
                            <td>${venta.fechaFinalizacion.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true })}</td>
                            <td>${venta.metodoPago}</td>
                            <td>$${parseFloat(venta.total).toFixed(2)}</td>
                        </tr>`;
                });

                // Pie de tabla con total general
                filasVentasDia += `
                    <tr style="background-color: #e6f7ff; font-weight: bold;">
                        <td colspan="3" style="text-align: right;">Total General:</td>
                        <td>$${totalGeneralDia.toFixed(2)}</td>
                        <td></td>
                    </tr>`;

                const tablaVentasDia = encabezadoVentasDia + filasVentasDia + '</tbody></table>';
                finalHTML = generarHTMLReporteView('Reporte de Ventas del Día', tablaVentasDia);
                reportName = `Reporte_Ventas_Del día_${getFechaHora3Segundos()}.pdf`;
                break;


            case 'Stock bajo':
                console.log('Generando reporte de Stock bajo');
                const data = await reportModels.getReportes();

                const encabezado = `
                    <table>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Cantidad</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>`;

                let filas = '';
                data.forEach(row => {
                    const esStockBajo = row.cantidad < 10;
                    const claseFila = esStockBajo ? 'class="stock-bajo"' : 'class="stock-normal"';
                    const estado = esStockBajo ? 'STOCK BAJO' : 'Normal';

                    filas += `
                        <tr ${claseFila}>
                            <td>${row.codigo}</td>
                            <td>${row.nombre}</td>
                            <td>${row.precio}</td>
                            <td>${row.cantidad}</td>
                            <td>${estado}</td>
                        </tr>`;
                });

                const tabla = encabezado + filas + '</tbody></table>';
                finalHTML = generarHTMLReporteView('Reporte de Stock Bajo', tabla);
                reportName = `Reporte_Stock_Bajo_${getFechaHora3Segundos()}.pdf`;
                break;

            case 'Productos inactivos':
                console.log('Generando reporte de Productos inactivos');
                // EJEMPLO PARA OTRO TIPO DE REPORTE
                const productosInactivos = await reportModels.getProductosInactivos();

                const encabezadoInactivos = `
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Última actualización</th>
                                <th>Razón</th>
                            </tr>
                        </thead>
                        <tbody>`;

                let filasInactivos = '';
                productosInactivos.forEach(producto => {
                    filasInactivos += `
                        <tr class="stock-bajo">
                            <td>${producto.id}</td>
                            <td>${producto.nombre}</td>
                            <td>${producto.ultima_actualizacion}</td>
                            <td>${producto.razon || 'Sin especificar'}</td>
                        </tr>`;
                });

                const tablaInactivos = encabezadoInactivos + filasInactivos + '</tbody></table>';
                finalHTML = generarHTMLReporteView('Reporte de Productos Inactivos', tablaInactivos);
                reportName = `Reporte_Productos_Inactivos_${getFechaHora3Segundos()}.pdf`;
                break;

            case 'Ventas del mes':
                console.log('Generando reporte de Ventas del mes');
                // EJEMPLO PARA REPORTE DE VENTAS
                const ventas = await reportModels.getReporteMes();

                const encabezadoVentas = `
                    <table>
                        <thead>
                            <tr>
                                <th>Ci cliente</th>
                                <th>fechaFinalizacion</th>
                                <th>Método de pago</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>`;

                let filasVentas = '';
                let totalGeneral = 0;
                console.log('cccccccccc   ', ventas);
                ventas.forEach(venta => {
                    totalGeneral += parseFloat(venta.total || 0);
                    //const fechaYHora = `${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})}`;
                    filasVentas += `
                        <tr>
                            <td>${venta.datosPago.cedula}</td>
                            <td>${venta.fechaFinalizacion.toLocaleDateString('es-ES')}</td>
                            <td>${venta.metodoPago}</td>
                            <td>$${parseFloat(venta.total).toFixed(2)}</td>
                        </tr>`;
                });

                // Pie de tabla con total general
                filasVentas += `
                    <tr style="background-color: #e6f7ff; font-weight: bold;">
                        <td colspan="3" style="text-align: right;">Total General:</td>
                        <td>$${totalGeneral.toFixed(2)}</td>
                        <td></td>
                    </tr>`;

                const tablaVentas = encabezadoVentas + filasVentas + '</tbody></table>';
                finalHTML = generarHTMLReporteView('Reporte de Ventas del Mes', tablaVentas);
                reportName = `Reporte_Ventas_Mes_${getFechaHora3Segundos()}.pdf`;
                break;

            case '0': // Productos desactivados
                console.log('Generando reporte de Productos desactivados');
                const productosDesactivados = await reportModels.getProductosDesactivados();

                // ... lógica similar para este reporte ...
                finalHTML = generarHTMLReporte('Productos Desactivados', '<p>Reporte en desarrollo...</p>');
                reportName = `Reporte_Desactivados_${getFechaHora3Segundos()}.pdf`;
                break;

            default:
                return res.status(400).json({
                    success: false,
                    message: 'Tipo de reporte no válido',
                    error: "Tipo no soportado",
                    tipos_disponibles: [
                        'Stock bajo',
                        'Productos inactivos',
                        'Ventas del mes',
                        '0' // Productos desactivados
                    ]
                });
        }

        // Generar el PDF en memoria (buffer)
        //const pdfBuffer = await generatePDFBuffer(finalHTML);

        // Configurar headers para descarga
        res.setHeader('Content-Type', 'application/txt');
        //res.setHeader('Content-Disposition', `attachment; filename="${reportName}"`);
        //res.setHeader('Content-Length', pdfBuffer.length);

        // Enviar el PDF como respuesta
        //res.send(pdfBuffer);
        return res.json({
            report: finalHTML
        });
    } catch (error) {
        console.error('Error en reports:', error);
        res.status(500).json({
            success: false,
            message: 'Error al generar el reporte',
            error: error.message
        });
    }
};




exports.p = async (req, res) => {
    try {

        reportModels.getReporteMes();

    } catch (error) {


    }
};