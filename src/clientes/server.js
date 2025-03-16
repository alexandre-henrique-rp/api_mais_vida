import { PrismaClient } from "@prisma/client";
import Logger from "../logger/index.js";

const prisma = new PrismaClient();

const ClienteServer = {
  /**
   * Cadastra um cliente
   * @param {object} data - Dados do cliente a ser cadastrado
   * @property {string} data.name - Nome do cliente
   * @property {string} data.email - Email do cliente
   * @property {string} data.cpf - CPF do cliente
   * @property {string} data.whatsapp - N mero do WhatsApp do cliente
   * @property {string} [data.cep] - CEP do cliente
   * @property {string} [data.endereco] - Endere o do cliente
   * @property {string} [data.numero] - N mero do cliente
   * @property {string} [data.bairro] - Bairro do cliente
   * @property {string} [data.cidade] - Cidade do cliente
   * @property {string} [data.uf] - UF do cliente
   * @property {string} [data.payment_id] - ID do pagamento do cliente
   * @property {boolean} [data.terreno] - Se o cliente tem terreno
   * @returns {object} - O cliente cadastrado
   * @throws {Error} - Erro ao cadastrar cliente
   */
  create: async (data) => {
    try {
      const cliente = await prisma.client.create({ data })
      Logger('success', `Cliente cadastrado: ${JSON.stringify(cliente)}`)
      return cliente
    } catch (error) {
      Logger('error', `Erro ao cadastrar cliente: ${error.message}`)
      throw new Error(`Erro ao cadastrar cliente: ${error.message}`)
    }
  },

  /**
   * Retorna todos os clientes
   * @returns {object[{id, name, email, cpf, whatsapp, payment[{id, valor, qr_code_base64, link_payment, status, status_detail, pg}], createdAt, updatedAt}]} - Array de clientes encontrados
   * @throws {Error} - Erro ao listar clientes
   */
  findAll: async () => {
    try {
      const clientes = await prisma.client.findMany(
        {
          include: {
            payments: {
              select: {
                id: true,
                valor: true,
                qr_code_base64: true,
                link_payment: true,
                status: true,
                status_detail: true,
                pg: true,
                createdAt: true,
                updatedAt: true,
              }
            }
          },
          select: {
            id: true,
            name: true,
            email: true,
            cpf: true,
            whatsapp: true,
            payment: true,
            createdAt: true,
            updatedAt: true,
          }
        },
      )
      Logger('success', `Clientes listados: ${JSON.stringify(clientes)}`)
      return clientes
    } catch (error) {
      Logger('error', `Erro ao listar clientes: ${error.message}`)
      throw new Error(`Erro ao listar clientes: ${error.message}`)
    }
  },

  /**
   * Procura um cliente por ID
   * @param {number} id - ID do cliente a ser procurado
   * @returns { id, name, email, cpf, whatsapp, cep, endereco, numero, bairro, cidade, uf, payment[{id, valor, qr_code_base64, link_payment, status, status_detail, pg, createdAt, updatedAt}], createdAt, updatedAt} - O cliente encontrado
   * @throws {Error} - Erro ao procurar cliente
   */
  findOne: async (id) => {
    try {
      const cliente = await prisma.client.findUnique({ where: { id }, include: { payments: true } })
      Logger('success', `Cliente listado: ${JSON.stringify(cliente)}`)
      return cliente
    } catch (error) {
      Logger('error', `Erro ao trazer info do cliente ${id}: ${error.message}`)
      throw new Error(`Erro ao trazer info do cliente ${id}: ${error.message}`)
    }
  },

  /**
   * Atualiza um cliente com base no ID fornecido
   * @param {number} id - ID do cliente a ser atualizado
   * @param { name, email, cpf, whatsapp, cep, endereco, numero, bairro, cidade, uf, payment_id} data - Dados atualizados do cliente
   * @returns {Promise<{ id, name, email, cpf, whatsapp, cep, endereco, numero, bairro, cidade, uf, payment[{id, valor, qr_code_base64, link_payment, status, status_detail, pg, createdAt, updatedAt}], createdAt, updatedAt}>} - O cliente atualizado com detalhes de pagamento incluídos
   * @throws {Error} - Erro ao atualizar cliente
   */

  update: async (id, data) => {
    try {
      const cliente = await prisma.client.update({ where: { id }, data, include: { payments: true } })
      Logger('success', `Cliente atualizado: ${JSON.stringify(cliente)}`)
      return cliente
    } catch (error) {
      Logger('error', `Erro ao atualizar cliente ${id}: ${error.message}`)
      throw new Error(`Erro ao atualizar cliente ${id}: ${error.message}`)
    }
  },

  /**
   * Deleta um cliente com base no ID fornecido
   * @param {number} id - ID do cliente a ser deletado
   * @returns {string} - Mensagem de sucesso
   * @throws {Error} - Erro ao deletar cliente
   */
  delete: async (id) => {
    try {
      await prisma.client.delete({ where: { id } })
      Logger('success', `Cliente deletado: ${id}`)
      return `Cliente deletado: ${id}`
    } catch (error) {
      Logger('error', `Erro ao deletar cliente ${id}: ${error.message}`)
      throw new Error(`Erro ao deletar cliente ${id}: ${error.message}`)
    }
  }
}

export default ClienteServer