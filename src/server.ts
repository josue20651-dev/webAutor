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
import {firmar} from '../firma'
const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(cors());

const apiKey = process.env['FLOW_API_KEY']!;
const secretKey = process.env['FLOW_SECRET_KEY']!;
const flowBaseUrl = process.env['FLOW_BASE_URL']!;
const baseUrl = process.env['BASE_URL']!;

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    `
default-src 'self';

script-src
  'self'
  'unsafe-inline'
  http://localhost:4200
  https://sandbox.flow.cl
  https://www.google.com
  https://www.gstatic.com
  https://h.online-metrix.net
  https://h64.online-metrix.net;

frame-src
  'self'
  https://sandbox.flow.cl
  https://www.google.com;

connect-src
  'self'
  http://localhost:4000
  https://sandbox.flow.cl
  https://www.google.com;

img-src
  'self'
  data:
  https:;

style-src
  'self'
  'unsafe-inline'
  https://fonts.googleapis.com;

font-src
  'self'
  data:
  https://fonts.gstatic.com;
`
      .replace(/\n/g, "")
  );

  next();
});

const ordenes = new Map<string, any>();

app.post('/crear-pago',
  express.json(),
  express.urlencoded({ extended: true }),
  async (req, res) => {
  try {
    const { items, total, email } = req.body;
    const commerceOrder = 'orden_' + Date.now();

    ordenes.set(commerceOrder, { items, total, email });

    const params: any = {
      apiKey,
      commerceOrder,
      subject: items.map((i: any) => i.titulo).join(', '),
      currency: 'CLP',
      amount: total,
      email,
      urlConfirmation: `${baseUrl}/confirmacion`,
      urlReturn: `${baseUrl}/pagoConfirmado`,
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
  console.log('📨 Flow llamó a /confirmacion');
  console.log('BODY FLOW:', req.body);

  // Responde OK inmediatamente para que Flow no haga timeout
  res.send('OK');

  try {
    const token = req.body.token;

    const params: any = {
      apiKey,
      token,
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

  } catch (error: any) {
    console.log('❌ ERROR CONFIRMACION:');
    console.log(error.response?.data || error.message);
  }
});

// ── ESTADO PAGO (para que el frontend consulte los datos del pago) ──
app.get('/estado-pago', async (req, res) => {
  try {
    const token = req.query['token'] as string;

    const params: any = { apiKey, token };
    const firma = firmar(params, secretKey);
    params.s = firma;

    const response = await axios.get(
      `${flowBaseUrl}/payment/getStatus`,
      { params }
    );

    res.json(response.data);
  } catch (error: any) {
    console.log('❌ ERROR ESTADO PAGO:', error.response?.data || error.message);
    res.status(500).send('Error consultando estado');
  }
});

app.post('/pagoConfirmado',
  express.urlencoded({ extended: true }),
  (req, res) => {

    console.log('📥 BODY COMPLETO FLOW:', req.body);

    const token = req.body.token_ws || req.body.token;

    if (!token) {
      console.log('❌ No vino token');
      return res.redirect('/pagoConfirmado');
    }

    console.log('✅ Token recibido:', token);

    res.redirect(`/pagoConfirmado?token_ws=${token}`);
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
