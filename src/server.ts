import 'dotenv/config';

import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
  
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import cors from 'cors';
import axios from 'axios';
import {firmar} from '../backend-flow/utils/firma'
const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */

app.use(cors());


const apiKey = process.env['FLOW_API_KEY']!;
const secretKey = process.env['FLOW_SECRET_KEY']!;
const flowBaseUrl = process.env['FLOW_BASE_URL']!;
const baseUrl = process.env['BASE_URL']!;

app.post('/crear-pago',
  express.json(),
  express.urlencoded({ extended: true }),
  async (req, res) => {
  try {
    const { nombre, precio, email } = req.body;

    const params: any = {
      apiKey: apiKey,
      commerceOrder: 'orden_' + Date.now(),
      subject: nombre,
      currency: 'CLP',
      amount: precio,
      email: email,
      urlConfirmation: `${baseUrl}/confirmacion`,
      urlReturn: `${baseUrl}`,
    };

    const firma = firmar(params, secretKey);
    params.s = firma;

    const response = await axios.post(
      `${flowBaseUrl}/payment/create`,
      new URLSearchParams(params).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    res.json(response.data);
  } catch (error: any) {
    console.log('❌ ERROR CREAR PAGO:');
    console.log(error.response?.data || error.message);
    res.status(500).send('Error al crear el pago');
  }
});

app.post('/confirmacion',
  express.json(),
  express.urlencoded({ extended: true }),
  async (req, res) => {
  console.log('BODY FLOW:', req.body);

  try {
    const token = req.body.token;

    const params: any = {
      apiKey: apiKey,
      token: token,
    };

    const firma = firmar(params, secretKey);
    params.s = firma;

    const response = await axios.get(
      `${flowBaseUrl}/payment/getStatus`,
      { params }
    );

    const estadoPago = response.data;

    console.log('🔔 Confirmación recibida');
    console.log(estadoPago);

    if (estadoPago.status === 2) {
      console.log('✅ PAGO APROBADO');
    }

    res.send('OK');
  } catch (error: any) {
    console.log('❌ ERROR CONFIRMACION:');
    console.log(error.response?.data || error.message);
    res.status(500).send('Error en confirmación');
  }
});

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
