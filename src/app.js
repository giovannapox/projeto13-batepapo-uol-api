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

