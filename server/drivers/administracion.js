

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);
const rename = promisify(fs.rename);


const {pool } = require('../config/db');



const {isnotBodyEmpty} = require('../utils/functions');


const administation = require('../models/administracion');




exports.admin = async (req, res) => {

    if (!req.session.user) {
        return res.status(401).json({ message: 'No autenticado' });
    }

    console.log("[admin driver] id: ", req.session.user.id);

    const credencial = await administation.getValid_acceso(req.session.user.id);
    console.log("/acceso/ ", credencial);
    if (credencial == "admin" || credencial == "personal") {
        const jsPath = path.join(__dirname, '../views/private-scripts/js.js');
        let jsContent = fs.readFileSync(jsPath, 'utf-8');

        res.render('admin', {
            embeddedJS: jsContent  // JS como string
        });
    } else {
        return res.json({ message: "error" });
    }


}

















//
exports.crearProducto = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ success: false, message: 'No autenticado' });
        }

        const credencial = await administation.getValid_acceso(req.session.user.id);
        if (credencial !== "admin" && credencial !== "personal") {
            return res.status(403).json({ success: false, message: 'Acceso no autorizado' });
        }

        if (!req.body.nombre || !req.body.precio) {
            return res.status(400).json({
                success: false,
                message: 'Nombre y precio son campos requeridos'
            });
        }

        let imagenesIds = [];
        if (req.files && req.files.imagenes) {
            const uploadDir = path.join(__dirname, '../../uploads/productos');

            try {
                await mkdir(uploadDir, { recursive: true });
            } catch (err) {
                if (err.code !== 'EEXIST') throw err;
            }

            const files = Array.isArray(req.files.imagenes) ?
                req.files.imagenes : [req.files.imagenes];

            const existingFiles = await readdir(uploadDir);
            const jpgFiles = existingFiles.filter(file => file.endsWith('.jpg'));
            const lastNumber = jpgFiles.length > 0 ?
                Math.max(...jpgFiles.map(f => parseInt(f.split('.')[0]))) : 0;

            for (let i = 0; i < files.length; i++) {
                const newNumber = lastNumber + i + 1;
                const newFilename = `${newNumber}.jpg`;
                const filePath = path.join(uploadDir, newFilename);

                await rename(files[i].tempFilePath || files[i].path, filePath);
                imagenesIds.push(newNumber);
            }
        }

        const productoData = {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion || '',
            precio: parseFloat(req.body.precio),
            precioOriginal: parseFloat(req.body.precioOriginal) || 0,
            imagenes: JSON.stringify(imagenesIds),
            estado: parseInt(req.body.estado) || 1,
            cantidad: parseInt(req.body.cantidad) || null,
            peso: parseFloat(req.body.peso) || 0,
            talla: req.body.talla || 'No especificado',
            categorias: req.body.categorias ? `[${parseInt(req.body.categorias)}]` : '[0]',
            color: req.body.color ? JSON.stringify([req.body.color]) : '[0]',
            marca: req.body.marca ? JSON.stringify([req.body.marca]) : 'sin marca'
        };
        console.log(productoData);
        const resultado = await administation.crearProducto(productoData);

        if (resultado.codigo > 0) {
            return res.status(201).json({
                success: true,
                id: resultado.codigo,
                message: resultado.mensaje
            });
        } else {
            return res.status(400).json({
                success: false,
                message: resultado.mensaje
            });
        }

    } catch (error) {
        console.error('Error al crear producto:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};


//








async function getLastImageNumber(uploadsDir) {
    const files = fs.readdirSync(uploadsDir);
    const jpgFiles = files.filter(file => file.endsWith('.jpg'));
    const numbers = jpgFiles.map(file => parseInt(file.split('.')[0]));
    return numbers.length > 0 ? Math.max(...numbers) : 0;
}



exports.getProductos = async (req, res) => {
    const { pagina = 1, limite = 30, buscar = '' } = req.query;

    try {
        const [results] = await pool.query('CALL sp_get_productos(?, ?, ?)', [
            buscar,
            parseInt(pagina),
            parseInt(limite)
        ]);

        res.json({
            productos: results[0],
            total: results[1][0].total,
            pagina: parseInt(pagina),
            limite: parseInt(limite)
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};











exports.deleteProducto = async (req, res) => {

    if (!req.session.user) {
        return res.status(401).json({ message: 'No autenticado' });
    }

    if(!isnotBodyEmpty){
        return res.json({
            message: "vacio"
        });
    }


    if (!req.body.id){
        return res.JSON({
            message : "Es necesario que seleciones el producto",
        });
    }

    console.log("[deleteProducto driver] id prod: ", req.body.id);

    const credencial =await administation.getValid_acceso(req.session.user.id);
    console.log("/acceso/ ", credencial);
    if (credencial == "admin" || credencial == "personal") {
        resultado = await administation.deleteProducto(req.body.id,res);
        console.log("[deleteProducto drive] resultado de la bdd",resultado);
        return res.json({
            message: resultado
        });
    } else {
        return res.json({ message: "error(else)" });
    }


}