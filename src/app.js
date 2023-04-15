import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import joi from "joi";

// Criando o server
const app = express();

// Configurando o server
app.use(cors());
app.use(express.json());
dotenv.config();

// Conectando com Banco de Dados
const mongoClient = new MongoClient(process.env.DATABASE_URL);
try{
    await mongoClient.connect();
    console.log("MongoDB conectado");
} catch (err) {
    console.log(err.message);
}
const db = mongoClient.db();

// endpoints 

app.post("/participants", (req, res) => {
    const { name } = req.body;
    // name deve ser string não vazia caso contrario res.sendStatus(422);
    // nome já usado res.sendStatus(409);
    res.sendStatus(201);
})

app.get("/participants", (req, res) => {

})

app.post("/messages", (req, res) => {
    const { to, text, type } = req.body;
})

app.get("/messages", (req, res) => {

})

app.post("/status", (req, res) => {

})

// App esperando requisições
const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

