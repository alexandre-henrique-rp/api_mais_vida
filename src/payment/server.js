import { PrismaClient } from "@prisma/client";
import Logger from "../logger/index.js";

const prisma = new PrismaClient();

const PaymentServer = {
  /**
   * Cria um novo pagamento
   * @param { { valor: number, clientId: number, pix_id?: string, notification_url?: string, id_payment?: string, qr_code_base64?: string, link_payment?: string, status?: string, status_detail?: string, pg?: boolean } } data - Dados do pagamento a ser criado
   * @returns { id, valor, clientId, pix_id, notification_url, id_payment, qr_code_base64, link_payment, status, status_detail, pg, createdAt, updatedAt } - O pagamento criado
   * @throws {Error} - Erro ao criar pagamento
   */
  create: async data => {
    try {
      const pagamento = await prisma.payment.create({ data, include: { Client: true } });
      Logger("success", `Pagamento criado: ${JSON.stringify(pagamento)}`);
      return pagamento;
    } catch (error) {
      Logger("error", `Erro ao criar pagamento: ${error.message}`);
      throw new Error(`Erro ao criar pagamento: ${error.message}`);
    }
  },

  /**
   * Retorna todos os pagamentos
   * @returns {object[{id, valor, clientId, pix_id, notification_url, id_payment, qr_code_base64, link_payment, status, status_detail, pg, createdAt, updatedAt}]} - Array de pagamentos encontrados
   * @throws {Error} - Erro ao listar pagamentos
   */
  findAll: async () => {
    try {
      const pagamentos = await prisma.payment.findMany();
      Logger("success", `Pagamentos listados: ${JSON.stringify(pagamentos)}`);
      return pagamentos;
    } catch (error) {
      Logger("error", `Erro ao listar pagamentos: ${error.message}`);
      throw new Error(`Erro ao listar pagamentos: ${error.message}`);
    }
  },

  /**
   * Procura um pagamento por ID
   * @param {number} id - ID do pagamento a ser procurado
   * @returns { id, valor, clientId, pix_id, notification_url, id_payment, qr_code_base64, link_payment, status, status_detail, pg, createdAt, updatedAt } - O pagamento encontrado
   * @throws {Error} - Erro ao trazer info do pagamento
   */
  findOne: async id => {
    try {
      const pagamento = await prisma.payment.findUnique({ where: { id }, include: { Client: true } });
      Logger("success", `Pagamento listado: ${JSON.stringify(pagamento)}`);
      return pagamento;
    } catch (error) {
      Logger(
        "error",
        `Erro ao trazer info do pagamento ${id}: ${error.message}`
      );
      throw new Error(
        `Erro ao trazer info do pagamento ${id}: ${error.message}`
      );
    }
  },

  findOneByPixId: async (pixId) => {
    try {
      const pagamento = await prisma.payment.findFirst({ where: { pix_id: pixId }, include: { Client: true } });
      Logger("success", `Pagamento listado: ${JSON.stringify(pagamento)}`);
      return pagamento;
    } catch (error) {
      Logger(
        "error",
        `Erro ao atualizar webhook ${id}: ${error.message}`
      );
      console.log("🚀 ~ findOneByPixId:", pagamento)
      throw new Error(
        `Erro ao atualizar webhook ${id}: ${error.message}`
      );
    }
  },

  /**
   * Atualiza um pagamento com base no ID fornecido
   * @param {number} id - ID do pagamento a ser atualizado
   * @param {object} data - Dados atualizados do pagamento
   * @returns { id, valor, clientId, pix_id, notification_url, id_payment, qr_code_base64, link_payment, status, status_detail, pg, createdAt, updatedAt } - O pagamento atualizado
   * @throws {Error} - Erro ao atualizar pagamento
   */
  update: async (id, data) => {
    try {
      const pagamento = await prisma.payment.update({ where: { id }, data, include: { Client: true } });
      Logger("success", `Pagamento atualizado: ${JSON.stringify(pagamento)}`);
      return pagamento;
    } catch (error) {
      console.log("🚀 ~ error:", error);
      Logger("error", `Erro ao atualizar pagamento ${id}: ${error.message}`);
      throw new Error(`Erro ao atualizar pagamento ${id}: ${error.message}`);
    }
  },

  /**
 * Deleta um pagamento com base no ID fornecido
 * @param {number} id - ID do pagamento a ser deletado
 * @returns {string} - Mensagem de sucesso
 * @throws {Error} - Erro ao deletar pagamento
 */

  delete: async id => {
    try {
      await prisma.payment.delete({ where: { id } });
      Logger("success", `Pagamento deletado: ${id}`);
      return `Pagamento deletado: ${id}`;
    } catch (error) {
      Logger("error", `Erro ao deletar pagamento ${id}: ${error.message}`);
      throw new Error(`Erro ao deletar pagamento ${id}: ${error.message}`);
    }
  }
};

export default PaymentServer;
