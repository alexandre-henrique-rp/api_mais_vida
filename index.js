import bodyParser from 'body-parser';
import express from 'express';
import ClienteServer from './src/clientes/server.js';
import InterfaceBank from './src/pix/server.js';
import Logger from './src/logger/index.js';

const app = express();
app.use(bodyParser.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  Logger('info', `Requisição recebida: ${req.method} ${req.url}`);
  next();
})

//cadastrar cliente
app.post('/clientes', (req, res) => {
  const { name, email, cpf, whatsapp, cep, endereco, numero, bairro, cidade, uf, payment_id } = req.body
  if (!name) res.status(400).send('name não fornecido')
  else if (!email) res.status(400).send('email não fornecido')
  else if (!cpf) res.status(400).send('cpf não fornecido')
  else if (!whatsapp) res.status(400).send('whatsapp não fornecido')
  else if (!cep) res.status(400).send('cep não fornecido')
  else if (!endereco) res.status(400).send('endereco não fornecido')
  else if (!numero) res.status(400).send('numero não fornecido')
  else if (!bairro) res.status(400).send('bairro não fornecido')
  else if (!cidade) res.status(400).send('cidade não fornecido')
  else if (!uf) res.status(400).send('uf não fornecido')
  else if (!payment_id) res.status(400).send('payment_id não fornecido')
  else {
    const retorno = ClienteServer.create(req.body)
    res.json(retorno)
  }
})

//listar clientes
app.get('/clientes', (req, res) => {
  const retorno = ClienteServer.findAll()
  res.json(retorno)
})

//listar cliente por id
app.get('/clientes/:id', (req, res) => {
  const { id } = req.params
  if (!id) res.status(400).send('ID não fornecido')
  else {
    const retorno = ClienteServer.findOne(req.params.id)
    res.json(retorno)
  }
})

//atualizar cliente
app.put('/clientes/:id', (req, res) => {
  if (!req.params.id) res.status(400).send('ID não fornecido')
  const { name, email, cpf, whatsapp, cep, endereco, numero, bairro, cidade, uf, payment_id } = req.body
  if (!name) res.status(400).send('name não fornecido')
  else if (!email) res.status(400).send('email não fornecido')
  else if (!cpf) res.status(400).send('cpf não fornecido')
  else if (!whatsapp) res.status(400).send('whatsapp não fornecido')
  else if (!cep) res.status(400).send('cep não fornecido')
  else if (!endereco) res.status(400).send('endereco não fornecido')
  else if (!numero) res.status(400).send('numero não fornecido')
  else if (!bairro) res.status(400).send('bairro não fornecido')
  else if (!cidade) res.status(400).send('cidade não fornecido')
  else if (!uf) res.status(400).send('uf não fornecido')
  else if (!payment_id) res.status(400).send('payment_id não fornecido')
  else {
    const retorno = ClienteServer.update(req.params.id, req.body)
    res.json(retorno)
  }
})

//deletar cliente
app.delete('/clientes/:id', (req, res) => {
  const { id } = req.params
  if (!id) res.status(400).send('ID não fornecido')
  else {
    const retorno = ClienteServer.delete(req.params.id)
    res.json(retorno)
  }
})

//gerar pix
app.post('/pix', async (req, res) => {
  const { valor, descricao, email, clientId } = req.body
  if (!valor) res.status(400).send('valor não fornecido')
  else if (!descricao) res.status(400).send('descricao não fornecido')
  else if (!email) res.status(400).send('email não fornecido')
  else if (!clientId) res.status(400).send('clientId não fornecido')
  else {
    const response = await InterfaceBank.PagamentoPix(valor, descricao, email, clientId)
    res.json(response)
  }
})

//verificar pix pelo id do pagamento
app.get('/pix/verificar/:id', async (req, res) => {
  const { id } = req.params
  if (!id) res.status(400).send('id não fornecido')
  else {
    const response = await InterfaceBank.verificarPix(id)
    res.json(response)
  }
})

//login
app.post('/login', (req, res) => {
  console.log(req.body)
  res.send('ok')
})

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000')
})