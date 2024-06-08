import nodemailer from "nodemailer";
import dotenv from "dotenv";
import {EmailModel} from "../dao/models/emails.js";

dotenv.config();

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

export async function sendEmail(type, to, additionalData) {
    try {
        const email = await EmailModel.findOne({ type });
        if (!email) throw new Error('Email template not found');

        let html = email.body;
        if (additionalData) {
            for (const key in additionalData) {
                html = html.replace(`{{${key}}}`, additionalData[key]);
            }
        }

        await transporter.sendMail({
            from: `Soporte <${process.env.EMAIL_SUPPORT}>`,
            to: to,
            subject: email.subject,
            html: html,
            attachments: [
                {
                    filename: `${type}.jpg`,
                    path: email.image,
                    cid: type
                }
            ]
        });
    } catch (error) {
        console.error(`Error al enviar el correo de tipo ${type}:`, error);
        throw error;
    }
}

//   export async function sendFirstClaimEmail(to, usuario) {
//     try {
//         await transporter.sendMail({
//             from: `Agencia de Cobranzas <${process.env.EMAIL}>`,
//             to: to,
//             subject: "Primer Email",
//             html: `<div>
//                       <h3 style='color: #a31e24', margin-bottom: 35px>Sr/a. ${usuario}</h3>
//                       <p>En esta oportunidad nos ponemos en contacto por la deuda que registra en el pago de su factura de luz.</p>
//                       <p>Para regularizar la situación por favor contactese al telefono 9999-9999</p>
//                       <p>O si tiene alguna consulta por favor contactenos a <a href="mailto:${process.env.EMAIL}">${process.env.EMAIL}</a>.</p>
//                       <p>Muchas gracias por su atención y esperamos poder asistrlo en el proceso.</p>
//                       <img src='cid:distribuidora' style='width: 100%; max-width: 600px; height: auto;' />
//                   </div>`,
//             attachments: [
//                 {
//                     filename: "distribuidora.jpg",
//                     path: "./src/public/img/distribuidora.jpg",
//                     cid: "distribuidora",
//                 }
//             ]
//         });
//     } catch (error) {
//         console.error("Error al enviar el correo de bienvenida:", error);
//         throw error;
//     }
//   }

//   export async function sendSecondEmail(to, usuario) {
//     try {
//         await transporter.sendMail({
//             from: `Agencia de Cobranzas <${process.env.EMAIL}>`,
//             to: to,
//             subject: "Segundo Email",
//             html: `<div>
//                       <h3 style='color: #a31e24', margin-bottom: 35px>Sr/a. ${usuario}</h3>
//                       <p>Este es el segundo reclamo acerca de la deuda impaga  que registra en su factura de luz.</p>
//                       <p>Para regularizar la situación por favor contactese al telefono 9999-9999</p>
//                       <p>O si tiene alguna consulta por favor contactenos a <a href="mailto:${process.env.EMAIL}">${process.env.EMAIL}</a>.</p>
//                       <p>Muchas gracias por su atención y esperamos poder asistrlo en el proceso.</p>
//                       <img src='cid:distribuidora' style='width: 100%; max-width: 600px; height: auto;' />
//                   </div>`,
//             attachments: [
//                 {
//                     filename: "distribuidora.jpg",
//                     path: "./src/public/img/distribuidora.jpg",
//                     cid: "distribuidora",
//                 }
//             ]
//         });
//     } catch (error) {
//         console.error("Error al enviar el correo de bienvenida:", error);
//         throw error;
//     }
//   }

//   export async function sendthirdEmail(to, usuario) {
//     try {
//         await transporter.sendMail({
//             from: `Agencia de Cobranzas <${process.env.EMAIL}>`,
//             to: to,
//             subject: "Tercer Email",
//             html: `<div>
//                     <h3 style='color: #a31e24', margin-bottom: 35px>Sr/a. ${usuario}</h3>
//                     <p>Este es el tercer aviso acerca de la deuda que registra en el pago de su factura de luz.</p>
//                     <p>Necesitamos que regularice la situación de forma urgente. En caso contrario, su caso será derivado al estudio jurídico.</p>
//                     <p>Para regularizar su situación, por favor contáctese al teléfono 9999-9999.</p>
//                     <p>O si tiene alguna consulta, por favor contáctenos a <a href="mailto:${process.env.EMAIL}">${process.env.EMAIL}</a>.</p>
//                     <p>Muchas gracias por su atención y esperamos poder asistirlo en el proceso.</p>
//                     <img src='cid:distribuidora' style='width: 100%; max-width: 600px; height: auto;' />
//                   </div>`,
//             attachments: [
//                 {
//                     filename: "distribuidora.jpg",
//                     path: "./src/public/img/distribuidora.jpg",
//                     cid: "distribuidora",
//                 }
//             ]
//         });
//     } catch (error) {
//         console.error("Error al enviar el correo de bienvenida:", error);
//         throw error;
//     }
//   }