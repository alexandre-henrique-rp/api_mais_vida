import 'dotenv/config';
// Step 1: Import the parts of the module you want to use
import { MercadoPagoConfig, Payment } from 'mercadopago';
import Logger from '../logger/index.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
// Step 2: Initialize the client object
const client = new MercadoPagoConfig({
  accessToken: process.env.ACS_TOKEN,
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

    // const pagamento = await prisma.payment.create({
    //   data: {
    //     valor: valor,
    //     clientId: clientId
    //   }
    // })

    // Step 4: Create the request object
    const body = {
      transaction_amount: valor,
      description: descricao,
      payment_method_id: 'pix',
      payer: {
        email: email
      },
      // rota de notificação
      notification_url: 'https://webhook.site/6f4c7b7b-2b2d-4a0f-bb4d-0b2b2d4a0fbb',
      // id externo
      // external_reference: pagamento.id
      external_reference: '123456',

    };
    try {
      const response = await payment.create({ body })
      const data = {
        id: response.id,
        status: response.status,
        status_detail: response.status_detail,
        external_reference: response.external_reference,
        ...(response.notification_url && { notification_url: response.notification_url }),
        qr_code: response.point_of_interaction.transaction_data.qr_code,
        qr_code_base64: response.point_of_interaction.transaction_data.qr_code_base64,
        ticket_url: response.point_of_interaction.transaction_data.ticket_url,
        transaction_id: response.point_of_interaction.transaction_data.transaction_id,
        createdAt: response.date_created
      }
      console.log("🚀 ~ PagamentoPix: ~ response:", response)
      Logger('success', `Pix criado: ${JSON.stringify(data)}`);
      // await PaymentServer.update(pagamento.id, response)
      return data;
    } catch (error) {
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
    // const pagamento = await prisma.payment.findUnique({ where: { id } })

    // // Step 4: Create the request object
    // const body = {
    //   id: pagamento.id_payment
    // };

    // Step 4: Create the request object
    const body = {
      id
    };

    try {
      const response = await payment.get(body)
      const data = {
        id: response.id,
        status: response.status,
        status_detail: response.status_detail,
        external_reference: response.external_reference,
        ...(response.notification_url && { notification_url: response.notification_url }),
        qr_code: response.point_of_interaction.transaction_data.qr_code,
        qr_code_base64: response.point_of_interaction.transaction_data.qr_code_base64,
        ticket_url: response.point_of_interaction.transaction_data.ticket_url,
        transaction_id: response.point_of_interaction.transaction_data.transaction_id,
        createdAt: response.date_created
      }
      Logger('success', `Pix listado: ${JSON.stringify(data)}`);
      // await PaymentServer.update(pagamento.id, response)
      return data
    } catch (error) {
      Logger('error', `Erro ao listar pix: ${err.message}`);
      throw new Error(`Erro ao listar pix: ${err.message}`);
    }
  }
}
export default InterfaceBank 
