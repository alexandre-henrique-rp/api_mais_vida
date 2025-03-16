import bodyParser from "body-parser";
import express from "express";
import ClienteServer from "./src/clientes/server.js";
import InterfaceBank from "./src/pix/server.js";
import Logger from "./src/logger/index.js";

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  Logger("info", `Requisição recebida: ${req.method} ${req.url}`);
  next();
});

//cadastrar cliente
app.post("/clientes", async (req, res) => {
  try {
    const {
      name,
      email,
      cpf,
      whatsapp,
      cep,
      endereco,
      numero,
      bairro,
      cidade,
      uf
    } = req.body;
    if (!name) res.status(400).send("name não fornecido");
    if (!email) res.status(400).send("email não fornecido");
    if (!cpf) res.status(400).send("cpf não fornecido");
    if (!whatsapp) res.status(400).send("whatsapp não fornecido");
    if (!cep) res.status(400).send("cep não fornecido");
    if (!endereco) res.status(400).send("endereco não fornecido");
    if (!numero) res.status(400).send("numero não fornecido");
    if (!bairro) res.status(400).send("bairro não fornecido");
    if (!cidade) res.status(400).send("cidade não fornecido");
    if (!uf) res.status(400).send("uf não fornecido");

    const retorno = await ClienteServer.create(req.body);
    res.json(retorno);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
});

//listar clientes
app.get("/clientes", async (req, res) => {
  try {
    const retorno = await ClienteServer.findAll();
    res.json(retorno);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
});

//listar cliente por id
app.get("/clientes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) res.status(400).send("ID não fornecido");
    const retorno = await ClienteServer.findOne(req.params.id);
    res.json(retorno);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
});

//atualizar cliente
app.put("/clientes/:id", async (req, res) => {
  try {
    if (!req.params.id) res.status(400).send("ID não fornecido");
    const {
      name,
      email,
      cpf,
      whatsapp,
      cep,
      endereco,
      numero,
      bairro,
      cidade,
      uf,
      payment_id,
    } = req.body;
    if (!name) res.status(400).send("name não fornecido");
    if (!email) res.status(400).send("email não fornecido");
    if (!cpf) res.status(400).send("cpf não fornecido");
    if (!whatsapp) res.status(400).send("whatsapp não fornecido");
    if (!cep) res.status(400).send("cep não fornecido");
    if (!endereco) res.status(400).send("endereco não fornecido");
    if (!numero) res.status(400).send("numero não fornecido");
    if (!bairro) res.status(400).send("bairro não fornecido");
    if (!cidade) res.status(400).send("cidade não fornecido");
    if (!uf) res.status(400).send("uf não fornecido");
    if (!payment_id) res.status(400).send("payment_id não fornecido");
    const retorno = await ClienteServer.update(req.params.id, req.body);
    res.json(retorno);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
});

//deletar cliente
app.delete("/clientes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) res.status(400).send("ID não fornecido");
    const retorno = await ClienteServer.delete(req.params.id);
    res.json(retorno);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
});

//gerar pix
app.post("/pix", async (req, res) => {
  try {
    const { valor, descricao, email, clientId } = req.body;
    if (!valor) res.status(400).send("valor não fornecido");
    if (!descricao) res.status(400).send("descricao não fornecido");
    if (!email) res.status(400).send("email não fornecido");
    if (!clientId) res.status(400).send("clientId não fornecido");
    const response = await InterfaceBank.PagamentoPix(
      valor,
      descricao,
      email,
      clientId
    );
    res.json(response);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
});

//verificar pix pelo id do pagamento
app.get("/pix/verificar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) res.status(400).send("id não fornecido");
    const response = await InterfaceBank.verificarPix(id);
    res.json(response);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
});

//verificar pix pelo id do pagamento
app.get("/webhook/verificar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) res.status(400).send("id não fornecido");
    const response = await InterfaceBank.verificarPixWebhook(id);
    res.json(response);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
});

//login
app.post("/login", async (req, res) => {
  console.log(req.body);
  res.send("ok");
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
