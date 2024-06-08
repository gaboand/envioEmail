import express from "express";
import { publicPath, viewsPath } from './utils.js';
import dotenv from "dotenv";
import mongoose from "mongoose";
import { ClientModel } from './dao/models/clients.js';
import { engine } from "express-handlebars";
import emailRoutes from './routes/email.routes.js';
import imageRoutes from './routes/image.routes.js';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 8080;
const DB_URL = process.env.DB_URL;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicPath));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', viewsPath);

app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

app.use('/emails', emailRoutes);
app.use('/images', imageRoutes);

app.post("/clients", async (req, res) => {
    const { nombre, apellido, email, usuario, deuda, vencimiento } = req.body;
    try {
        const newClient = new ClientModel({ nombre, apellido, email, usuario, deuda, vencimiento });
        await newClient.save();
        res.status(201).send('Cliente creado exitosamente');
    } catch (error) {
        console.error('Error al crear el cliente:', error);
        res.status(500).send('Error al crear el cliente');
    }
});

app.get('/clients/:emailsSent', async (req, res) => {
    const { emailsSent } = req.params; // Obtiene el número de correos enviados desde la URL
    try {
        const clients = await ClientModel.find({ emailsEnviados: emailsSent });
        res.json(clients);
    } catch (error) {
        res.status(500).send('Error al obtener los clientes');
    }
});

app.post('/sendfirstclaimemail', async (req, res) => {
    const { to, usuario } = req.body;

    try {
        await sendFirstClaimEmail(to, usuario);
        await ClientModel.updateOne({ email: to }, { $inc: { emailsEnviados: 1 } });
        res.status(200).json({ success: true, message: 'Email enviado correctamente' });
    } catch (error) {
        console.error('Error enviando correo o actualizando la base de datos:', error);
        res.status(500).json({ success: false, message: 'Error al enviar el correo o actualizar la base de datos' });
    }
});

app.post('/sendsecondemail', async (req, res) => {
    const { to, usuario } = req.body;

    try {
        await sendSecondEmail(to, usuario);
        await ClientModel.updateOne({ email: to }, { $inc: { emailsEnviados: 1 } });
        res.status(200).json({ success: true, message: 'Email enviado correctamente' });
    } catch (error) {
        console.error('Error enviando el segundo correo o actualizando la base de datos:', error);
        res.status(500).send('Error al enviar el segundo correo o actualizar la base de datos');
    }
});

app.post('/sendthirdemail', async (req, res) => {
    const { to, usuario } = req.body;

    try {
        await sendthirdEmail(to, usuario);
        await ClientModel.updateOne({ email: to }, { $inc: { emailsEnviados: 1 } });
        res.status(200).json({ success: true, message: 'Email enviado correctamente' });
    } catch (error) {
        console.error('Error enviando el tercer correo o actualizando la base de datos:', error);
        res.status(500).send('Error al enviar el tercer correo o actualizar la base de datos');
    }
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})

startMongoConnection()
  .then(() => {
    console.log("Base de datos conectada");
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
  });

async function startMongoConnection() {
    await mongoose.connect(DB_URL);
}

export default app;
