import mongoose from "mongoose";

const clientCollection = "clients";

const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true, max: 100 },
  apellido: { type: String, required: true, max: 100 },
  email: { type: String, required: true, max: 100 },
  usuario: { type: String, required: true, max: 100 },
  deuda: { type: Number, default: 0 },
  vencimiento: { type: Date },
  emailsEnviados: { type: Number, default: 0 }
});

export const ClientModel = mongoose.model(clientCollection, UserSchema);