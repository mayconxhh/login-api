'use strict'

const { seedGenerator, valueNumber, desencriptar, encriptar, createSessionUid } = require('../services/bcrypt');
const { createTokenSession } = require('../services/jwt');
const KeyboardGenerate = require('../models/KeyboardGenerateModel');
const User = require('../models/userModel');
const SessionIdentifier = require('../models/sessionModel');

async function UserNumberGenerate(req, res) {

    const numbers = [
        { number: 1, value: valueNumber(1) },
        { number: 2, value: valueNumber(2) },
        { number: 3, value: valueNumber(3) },
        { number: 4, value: valueNumber(4) },
        { number: 5, value: valueNumber(5) },
        { number: 6, value: valueNumber(6) },
        { number: 7, value: valueNumber(7) },
        { number: 8, value: valueNumber(8) },
        { number: 9, value: valueNumber(9) },
        { number: 0, value: valueNumber(0) }
    ];

    function mezclarArreglo(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }



    const keyboardGenerate = new KeyboardGenerate({
        seed: seedGenerator(new Date().getTime()),
        keyboard: mezclarArreglo(numbers)
    });

    try {
        const keyboardGenerateStored = await keyboardGenerate.save();
        if (!keyboardGenerateStored) {
            return res.status(404).send({ message: 'No se pudo generar el teclado' });
        }

        return res.status(200).send({
            message: 'Teclado generado exitosamente',
            seed: keyboardGenerateStored.seed,
            keyboard: keyboardGenerateStored.keyboard
        });
    } catch (err) {
        return res.status(500).send({ message: 'Error al guardar el teclado' });
    }
}

async function newUser(req, res) {
    const { email, cellphone, clave } = req.body;

    if (!email) {
        return res.status(400).send({ message: 'Correo no proporcionado' });
    }

    if (!cellphone) {
        return res.status(400).send({ message: 'Celular de usuario no proporcionado' });
    }

    if (!clave) {
        return res.status(400).send({ message: 'Clave de usuario no proporcionada' });
    }

    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ cellphone: cellphone, email: email });
        if (existingUser) {
            return res.status(409).send({ message: 'El usuario ya existe' });
        }

        // Encriptar la clave
        const claveEncriptada = encriptar("111111");

        // Crear un nuevo usuario
        const newUser = new User({
            email: email,
            cellphone: cellphone,
            clave: claveEncriptada
        });

        const userStored = await newUser.save();
        if (!userStored) {
            return res.status(500).send({ message: 'Error al guardar el usuario' });
        }

        return res.status(201).send({
            message: 'Usuario creado exitosamente',
            user: userStored
        });
    } catch (err) {
        console.error('Error al crear el usuario:', err);
        return res.status(500).send({ message: 'Error al crear el usuario' });
    }
}

async function UserAuthentication(req, res) {

    const { seed, keyboard, email } = req.body;
    let clave = "";

    if (!seed) {
        return res.status(400).send({ message: 'Semilla no proporcionada' });
    }

    if (!keyboard) {
        return res.status(400).send({ message: 'Clave no proporcionada' });
    }

    if (!email) {
        return res.status(400).send({ message: 'Correo de usuario no proporcionado' });
    }

    try {
        // Buscar el documento en la colección KeyboardGenerate por seed
        const keyboardDoc = await KeyboardGenerate.findOne({ seed: seed });
        if (!keyboardDoc) {
            return res.status(404).send({ message: 'Teclado no encontrado para la semilla proporcionada' });
        }

        let keyboardB = keyboardDoc.keyboard;

        for (let i = 0; i < keyboard.length; i++) {
            const key1 = keyboard[i];
            for(let j = 0; j < keyboardB.length; j++){
                const key2 = keyboardB[j];
                if (key1.value === key2.value) {
                    clave += key2.number.toString();
                    break;
                }
            }
        }

        try {
            // Aquí podrías guardar el intento de autenticación o cualquier otra lógica adicional
            const UserDB = await User.findOne({ email: email });
            if (!UserDB) {
                return res.status(404).send({ message: 'Usuario no encontrado' });
            }

            // Verificar si la clave proporcionada es correcta
            if (!UserDB.clave) {
                return res.status(400).send({ message: 'Clave de usuario no proporcionada' });
            }

            // Desencriptar la clave almacenada
            let claveDesencriptada;
            try {
                claveDesencriptada = desencriptar(UserDB.clave);
            } catch (err) {
                await eliminarSemilla(seed);
                return res.status(500).send({ message: 'Error al desencriptar la clave' });
            }

            // Comparar claves
            if (clave !== claveDesencriptada) {
                await eliminarSemilla(seed);
                return res.status(401).send({ message: 'Clave incorrecta' });
            }

            // Si la clave es correcta, puedes continuar con la lógica de autenticación
            let sessionUid = createSessionUid();
            let tokenSession = createTokenSession({
                cellphone: UserDB.cellphone,
                email: UserDB.email,
                sessionUid: sessionUid
            });

            try {
                
                let sessionStored = await SessionIdentifier.findOneAndUpdate(
                    { cellphone: UserDB.cellphone },
                    { sessionIdentifier: sessionUid },
                    { new: true, upsert: true }
                );

                if (!sessionStored) {
                    await eliminarSemilla(seed);
                    return res.status(500).send({ message: 'Error al guardar la sesión' });
                }

                res.status(200).send({
                    message: 'Autenticación exitosa',
                    token: tokenSession
                });

                await eliminarSemilla(seed);
                return;

            } catch (err) {
                // Si ocurre un error, elimina la semilla de la base de datos
                console.error('Error al guardar la sesión:', err);
                await eliminarSemilla(seed);
                return res.status(500).send({ message: 'Error al guardar la sesión' });
            }

        } catch (err) {
            // Si ocurre un error, elimina la semilla de la base de datos
            await eliminarSemilla(seed);
            return res.status(500).send({ message: 'Error al buscar el usuario' });
        }

    } catch (err) {

        // Si ocurre un error, elimina la semilla de la base de datos
        await eliminarSemilla(seed);
        return res.status(500).send({ message: 'Error al buscar el teclado' });
    }
}

async function eliminarSemilla(seed) {
    try {
        await KeyboardGenerate.deleteOne({ seed });
    } catch (deleteErr) {
        console.error('Error al eliminar la semilla:', deleteErr);
    }
}

module.exports = {
    UserNumberGenerate,
    UserAuthentication,
    newUser
};