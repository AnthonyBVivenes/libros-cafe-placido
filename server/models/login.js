const {pool} = require('../config/db.js');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

class Login {
    static async registerUser(email, plainPassword) {
        try {
            // Validación de formato de email
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                throw new Error('Formato de email inválido');
            }

            // Validación de fortaleza de contraseña
            if (plainPassword.length < 8) {
                throw new Error('La contraseña debe tener al menos 8 caracteres');
            }

            const hash = await bcrypt.hash(plainPassword, saltRounds);

            const [result] = await pool.query(
                'CALL Post_new_user(?, ?, ?)',
                [email, hash, nombre]
            );

            return {
                id: result.insertId,
                email,
                nombre,
                createdAt: new Date()
            };

        } catch (error) {
            console.error('Error en registerUser:', error);
            throw error; // Re-lanzamos el error para manejarlo en el controlador
        }
    }

    static async LoginUser(email, plainPassword) {
        try {
            // Buscar el usuario en la base de datos
            const [rows] = await pool.query('CALL Get_auth(?);', [email]);

            /*
            if (!rows || rows.length === 0 || rows[0].length === 0) {
                throw new Error('Usuario no encontrado');
            }*/

            const user = rows[0][0];

            console.log("555   ,", user);

            let pass = false;

            // Comparar la contraseña proporcionada con la almacenada
            const isMatch = await bcrypt.compare(plainPassword, user.key);
            if (!isMatch) {
                //throw new Error('Contraseña incorrecta');
                console.log("incorrecta")
                pass = false;
            } else {
                console.log("correcta")
                pass = true;
            }


            if (!rows || rows.length === 0 || rows[0].length === 0) {
                return {
                    std: 1,
                };

            } else {

                if (!pass) {
                    return {
                        std: 0,
                        passworld: false
                    };
                }
                return {
                    std: 0,
                    passworld: true,
                    email: email,
                    nombre: user.nombre,
                    id: user.id,
                    credenciales: user._credenciales
                };
            }


        } catch (error) {
            console.error('Error en LoginUser:', error);
            throw error;
        }
    }
}

module.exports = Login;