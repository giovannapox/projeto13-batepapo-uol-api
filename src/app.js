import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import joi from "joi";
import dayjs from "dayjs";

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

app.post("/participants", async (req, res) => {
    const { name } = req.body;

    const usuarioSchema = joi.object({
        name: joi.string().required()
    })

    const validation = usuarioSchema.validate(req.body, { abortEarly: false});

    if(validation.error){
        const erros = validation.error.details.map(detail => detail.message);
        return res.status(422).send(erros);
    }

    try {
        const participantes = await db.collection("participants").find().toArray();
        if(participantes.find(participante => participante.name === name)) return res.sendStatus(409);
        
        const novoUsuario = { name, lastStatus: Date.now()}
        await db.collection("participants").insertOne(novoUsuario);

        const mensagem = {
            from: name,
            to: 'Todos',
            text: 'entra na sala...',
            type: 'status',
            time: dayjs().format('HH:mm:ss')
        }
        await db.collection("messages").insertOne(mensagem);
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
    
})

app.get("/participants", async (req, res) => {
    try {
        const participantes = await db.collection("participants").find().toArray();
        return res.send(participantes);
    } catch (err) {
        res.status(500).send(err.message);
    }
})

app.post("/messages", async (req, res) => {
    const from = req.headers.user;

    try{
        const usuario = await db.collection("participants").findOne();
        if(!usuario) return res.status(404).send("Usuário não encontrado");

        const mensagemSchema = joi.object({
            to: joi.string().required(),
            text: joi.string().required(),
            type: joi.string().required().valid("private_message", "message"),
            from: joi.string().required()
        })

        const mensagem = {...req.body, from };
        const validation = mensagemSchema.validate(mensagem, { abortEarly: false });
        if(validation.error){
            const erros = validation.error.details.map(detail => detail.message);
            return res.status(422).send(erros);
        }

        await db.collection("messages").insertOne({...mensagem, time: dayjs().format('HH:mm:ss')});
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message)
    }
})

app.get("/messages", (req, res) => {
    try{

    } catch (err) {
        res.status(500).send(err.message)
    }
})

app.post("/status", (req, res) => {
    try{

    } catch (err) {
        res.status(500).send(err.message)
    }
})

// App esperando requisições
const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

