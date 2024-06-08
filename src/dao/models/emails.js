import mongoose from 'mongoose';

const emailCollection = "emails";

const EmailSchema = new mongoose.Schema({
    type: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    image: { type: String, required: false }
});
export const EmailModel = mongoose.model(emailCollection, EmailSchema);
