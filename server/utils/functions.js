

exports.isnotBodyEmpty = (req, res) => {

    if (!req.body || Object.keys(req.body).length === 0) {
        res.status(400).json({ error: 'Cuerpo de solicitud vacío' });
        return 0;
    }
    return 1;
};





//getFechaHora3Segundos

exports.getFechaHora3Segundos = () => {
    const ahora = new Date();
    const segundos = ahora.getSeconds();
    const segundosRedondeados = Math.floor(segundos / 3) * 3;
    
    const fecha = new Date(ahora);
    fecha.setSeconds(segundosRedondeados, 0);
    
    return fecha.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).replace(',', '');
}
