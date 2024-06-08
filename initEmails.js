import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {EmailModel} from './src/dao/models/emails.js';

dotenv.config();

async function initializeDatabase() {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('Connected to MongoDB');

        const emailTemplates = [
            {
                type: 'passwordReset',
                subject: 'Instrucciones para restablecer tu contraseña',
                body: `<div><h1 style='color: gray'>Restablecer Contraseña</h1><p>Hola,<br><br>Recibimos una solicitud para restablecer tu contraseña. Por favor, haz clic en el siguiente enlace para establecer una nueva contraseña: <a href="{{link}}" style="font-size: 16px;">Restablecer Contraseña</a><br><br>Si no solicitaste esto, por favor ignora este correo electrónico.</p><br>Saludos,<br>Tu Equipo de Soporte<br><br> <img src='cid:reset' style='width: 800px; height: auto;' /></div>`,
                image: './src/public/img/reset.jpg'
            },
            {
                type: 'welcome',
                subject: '¡Bienvenido a IA Collections!',
                body: `<div><h1 style='color: #3478f7'>¡Hola, {{userName}}!</h1><p>Estamos encantados de darte la bienvenida a IA Collections!!.</p><p>Para empezar, te recomendamos...</p><p>Si tienes alguna pregunta, no dudes a contactarnos en <a href="mailto:${process.env.EMAIL}">${process.env.EMAIL}</a>.</p><p>¡Gracias por unirte a nosotros y bienvenido a la familia!</p><img src='cid:welcome' style='width: 100%; max-width: 600px; height: auto;' /></div>`,
                image: './src/public/img/welcome.jpg'
            },
            // Agrega más plantillas según sea necesario
        ];

        for (const template of emailTemplates) {
            await EmailModel.findOneAndUpdate(
                { type: template.type },
                template,
                { upsert: true }
            );
        }

        console.log('Email templates initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Connection to MongoDB closed');
    }
}

initializeDatabase();
