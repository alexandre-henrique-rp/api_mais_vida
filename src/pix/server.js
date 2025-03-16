import 'dotenv/config';
// Step 1: Import the parts of the module you want to use
import { MercadoPagoConfig, Payment } from 'mercadopago';
import Logger from '../logger/index.js';
import PaymentServer from '../payment/server.js';

// Step 2: Initialize the client object
const client = new MercadoPagoConfig({
  accessToken: process.env.ACS_TOKEN_PROD,
  options: {
    timeout: 5000
  }
});

// Step 3: Initialize the API object
const payment = new Payment(client);

const InterfaceBank = {
  /**
   *
   * @param {number} valor exp = 220.99
   * @param {string} descricao exp= 'evento Kaiak'
   * @param {string} email exp= 'maisvidas@gmail.com'
   * @param {number} clientId exp= 1
   * @returns { id, valor, clientId, pix_id, notification_url, id_payment, qr_code_base64, link_payment, status, status_detail, pg, createdAt, updatedAt }
   */
  PagamentoPix: async (valor, descricao, email, clientId) => {
    try {
      const pagamento = await PaymentServer.create({
        valor: valor,
        client_id: clientId
      })

      // Step 4: Create the request object
      const body = {
        transaction_amount: valor,
        description: descricao,
        payment_method_id: 'pix',
        payer: {
          email: email
        },
        // rota de notificação
        notification_url: 'https://webhook.kingdevtec.com/mais_vida/pix',
        // id externo
        external_reference: pagamento.id
      };

      const response = await payment.create({ body })
      const data = {
        pix_id: response.id.toString(),
        status: response.status,
        status_detail: response.status_detail,
        ...(response.notification_url && { notification_url: response.notification_url }),
        qr_code: response.point_of_interaction.transaction_data.qr_code,
        qr_code_base64: response.point_of_interaction.transaction_data.qr_code_base64,
        link_payment: response.point_of_interaction.transaction_data.ticket_url,
        dt_generated: response.date_created
      }
      Logger('success', `Pix criado: ${JSON.stringify(data)}`);
      const retorno = await PaymentServer.update(pagamento.id, data)
      return retorno;
    } catch (error) {
      console.log("🚀 ~ error:", error);
      Logger('error', `Erro ao criar pix: ${err.message}`);
      throw new Error(`Erro ao criar pix: ${err.message}`);
    }
  },

  /**
   * Verifica se um pagamento por pix j  foi efetuado
   * @param {number} id - ID do pagamento a ser verificado
   * @returns {Promise<{ id, valor, clientId, pix_id, notification_url, id_payment, qr_code_base64, link_payment, status, status_detail, pg, createdAt, updatedAt }>} - Retorna o pagamento com status atualizado
   * @throws {Error} - Erro ao verificar pagamento
   */
  verificarPix: async (id) => {
    try {
      const pagamento = await PaymentServer.findOne(id)

      // Step 4: Create the request object
      const body = {
        id: Number(pagamento.pix_id)
      };

      const response = await payment.get(body)
      const data = {
        pix_id: response.id.toString(),
        status: response.status,
        status_detail: response.status_detail,
        ...(response.notification_url && { notification_url: response.notification_url }),
        qr_code: response.point_of_interaction.transaction_data.qr_code,
        qr_code_base64: response.point_of_interaction.transaction_data.qr_code_base64,
        link_payment: response.point_of_interaction.transaction_data.ticket_url,
        dt_generated: response.date_created,
        ...(response.date_approved && { dt_payment: response.date_approved }),
        ...(response.status === 'approved' && { pg: true })
      }
      Logger('success', `Pix listado: ${JSON.stringify(data)}`);
       const retornoAtualizado = await PaymentServer.update(pagamento.id, data)

      return retornoAtualizado
    } catch (error) {
      console.log("🚀 ~ verificarPix: ~ error:", error)
      Logger('error', `Erro ao listar pix: ${err.message}`);
      throw new Error(`Erro ao listar pix: ${err.message}`);
    }
  },
  verificarPixWebhook: async (id) => {
    try {
      const pagamento = await PaymentServer.findOneByPixId(id)

      // Step 4: Create the request object
      const body = {
        id: Number(id)
      };

      const response = await payment.get(body)
      const data = {
        pix_id: response.id.toString(),
        status: response.status,
        status_detail: response.status_detail,
        ...(response.notification_url && { notification_url: response.notification_url }),
        qr_code: response.point_of_interaction.transaction_data.qr_code,
        qr_code_base64: response.point_of_interaction.transaction_data.qr_code_base64,
        link_payment: response.point_of_interaction.transaction_data.ticket_url,
        dt_generated: response.date_created,
        ...(response.date_approved && { dt_payment: response.date_approved }),
        ...(response.status === 'approved' && { pg: true })
      }
      Logger('success', `Pix listado: ${JSON.stringify(data)}`);
       await PaymentServer.update(pagamento.id, data)

      return 'OK'
    } catch (error) {
      console.log("🚀 ~ verificarPix: ~ error:", error)
      Logger('error', `Erro ao listar pix: ${err.message}`);
      throw new Error(`Erro ao listar pix: ${err.message}`);
    }
  }
}
export default InterfaceBank
