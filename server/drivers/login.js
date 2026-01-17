const {pool} = require('../config/db.js');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const Login = require('../models/login');

exports.createUser = async (email, plainPassword, nombre) => {
    try {
        if (!email || !plainPassword || !nombre) {
            throw new Error('Faltan campos requeridos');
        }

        const hash = await bcrypt.hash(plainPassword, saltRounds);
        const [result] = await pool.query(
            'INSERT INTO usuarios (email, contraseña_hash, nombre) VALUES (?, ?, ?)',
            [email, hash, nombre]
        );

        return {
            id: result.insertId,
            email,
            nombre,
            message: 'Usuario creado exitosamente'
        };
    } catch (error) {
        console.error('Error en createUser:', error);
        throw error;
    }
};




exports.loginUser = async (req, res) => {
    try {
        console.log('loginUser.... ',res.body);
        const { email, Password } = req.body;

        if (!email || !Password) {
            return res.status(400).json({
                error: 'Faltan campos requeridos',
                details: 'Email y contraseña son obligatorios'
            });
        }
        console.log(" gg ", Password);

        const user = await Login.LoginUser(email, Password);
        console.log("== ", user)

        if (user.std == 0) {
    //std se encontró 
    if (user.passworld) {
        // Guardar usuario en la sesión
        req.session.user = {
            email: user.email,
            nombre: user.nombre,
            id: user.id,
            credenciales: user.credenciales
            
        };
        return res.status(200).json({
            message: 'Inicio de sesión exitoso',
            email: user.email,
            nombre: user.nombre
        });
    } else {
        return res.status(200).json({
            message: 'Contraseña/correo incorrecta'
        });
    }
} else {
    return res.status(200).json({
        message: 'Contraseña/correo incorrecta'
    });
}



    } catch (error) {
        console.error('Error en loginUser:', error);

        if (error.message === 'Usuario no encontrado' || error.message === 'Contraseña incorrecta') {
            return res.status(401).json({ error: error.message });
        }

        res.status(500).json({
            error: 'Error',
            details: error.message
        });
    }
};