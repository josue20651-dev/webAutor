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
import { firmar } from '../firma';
import { Resend } from 'resend';
 
const browserDistFolder = join(import.meta.dirname, '../browser');
 
const app = express();
const angularApp = new AngularNodeAppEngine();
 
app.use(cors());
 
const resend       = new Resend(process.env['RESEND_API_KEY']);
const resendEmail  = process.env['RESEND_EMAIL'] as string;
const apiKey       = process.env['FLOW_API_KEY']!;
const secretKey    = process.env['FLOW_SECRET_KEY']!;
const flowBaseUrl  = process.env['FLOW_BASE_URL']!;
const baseUrl      = process.env['BASE_URL']!;
 
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    `
default-src 'self';
script-src 'self' 'unsafe-inline' http://localhost:4200 https://sandbox.flow.cl https://www.google.com https://www.gstatic.com https://h.online-metrix.net https://h64.online-metrix.net;
frame-src 'self' https://sandbox.flow.cl https://www.google.com;
connect-src 'self' http://localhost:4000 https://sandbox.flow.cl https://www.google.com;
img-src 'self' data: https:;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' data: https://fonts.gstatic.com;
`.replace(/\n/g, '')
  );
  next();
});
 
const ordenes = new Map<string, any>();
 
// ══════════════════════════════════════════════════
// HELPERS — plantillas de correo
// ══════════════════════════════════════════════════
 
function correoContacto(nombre: string, telefono: string, email: string, mensaje: string): string {
  return `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#3a2a2a;">
      <h2 style="color:#9B5C68;border-bottom:1px solid #e8a5b2;padding-bottom:8px;">
        📬 Nuevo mensaje de contacto
      </h2>
      <p><b>Nombre:</b> ${nombre}</p>
      <p><b>Teléfono:</b> ${telefono}</p>
      <p><b>Email:</b> ${email}</p>
      <hr style="border:none;border-top:1px solid #f5d5da;margin:16px 0;">
      <p><b>Mensaje:</b></p>
      <p style="background:#fdf6f0;padding:14px;border-radius:8px;line-height:1.7;">${mensaje}</p>
    </div>
  `;
}
 
function correoCompra(
  nombre: string,
  telefono: string,
  email: string,
  items: { titulo: string; tipo: string }[],
  total: number,
  entrega: { region: string; comuna: string; direccion: string },
  tienesFisico: boolean
): string {
  const filaItems = items
    .map(i => `<tr>
      <td style="padding:6px 12px;">${i.titulo}</td>
      <td style="padding:6px 12px;color:#9B5C68;">${i.tipo}</td>
    </tr>`)
    .join('');
 
  const seccionEntrega = tienesFisico
    ? `
      <h3 style="color:#9B5C68;margin-top:28px;">📦 Datos de entrega</h3>
      <p><b>Región:</b> ${entrega.region}</p>
      <p><b>Comuna:</b> ${entrega.comuna}</p>
      <p><b>Dirección:</b> ${entrega.direccion}</p>
    `
    : `<p style="color:#888;font-size:13px;margin-top:20px;">✉️ Compra solo digital — no requiere entrega física.</p>`;
 
  return `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#3a2a2a;">
      <h2 style="color:#9B5C68;border-bottom:1px solid #e8a5b2;padding-bottom:8px;">
        🌸 Nueva compra confirmada
      </h2>
 
      <h3 style="color:#9B5C68;margin-top:24px;">👤 Datos del cliente</h3>
      <p><b>Nombre:</b> ${nombre}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Teléfono:</b> ${telefono}</p>
 
      <h3 style="color:#9B5C68;margin-top:24px;">📚 Productos</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead>
          <tr style="background:#f5d5da;color:#9B5C68;">
            <th style="padding:6px 12px;text-align:left;">Título</th>
            <th style="padding:6px 12px;text-align:left;">Tipo</th>
          </tr>
        </thead>
        <tbody>${filaItems}</tbody>
      </table>
 
      <p style="margin-top:14px;font-size:16px;">
        <b>Total cobrado:</b>
        <span style="color:#9B5C68;font-size:18px;"> $${total.toLocaleString('es-CL')} CLP</span>
      </p>
 
      ${seccionEntrega}
 
      <hr style="border:none;border-top:1px solid #f5d5da;margin:24px 0;">
      <p style="font-size:12px;color:#aaa;text-align:center;">
        Pago procesado vía Flow · con amor ✦
      </p>
    </div>
  `;
}
 
// ══════════════════════════════════════════════════
// RUTA — Formulario de contacto
// ══════════════════════════════════════════════════
app.post('/contacto',
  express.json(),
  async (req, res): Promise<any> => {
    try {
      const { nombre, email, mensaje, telefono } = req.body;
 
      if (!nombre || !email || !mensaje) {
        return res.status(400).json({ error: 'Faltan campos' });
      }
 
      await resend.emails.send({
        from:    'Contacto <onboarding@resend.dev>',
        to:      [resendEmail],
        subject: `Nuevo mensaje de ${nombre}`,
        html:    correoContacto(nombre, telefono || 'No ingresado', email, mensaje),
      });
 
      return res.json({ ok: true });
    } catch (error) {
      console.error('❌ ERROR ENVÍO EMAIL CONTACTO:', error);
      return res.status(500).json({ error: 'Error enviando correo' });
    }
  }
);
 
// ══════════════════════════════════════════════════
// CATÁLOGO — precios reales (nunca desde el frontend)
// ══════════════════════════════════════════════════
const catalogoNovelas: Record<number, { titulo: string; precio: number }> = {
  1: { titulo: 'El Lobo y la Luna', precio: 9990 }, // 9,99 USD expresado en CLP aprox — ajusta según tu conversión
};
 
const COSTO_ENVIO = 5490;
 
// ══════════════════════════════════════════════════
// RUTA — Crear pago Flow
// ══════════════════════════════════════════════════
app.post('/crear-pago',
  express.json(),
  express.urlencoded({ extended: true }),
  async (req, res) => {
    try {
      const { items, email, nombre, telefono, entrega } = req.body;
 
      const subtotal = items.reduce((acc: number, item: any) => {
        const novela = catalogoNovelas[item.id];
        return acc + (novela ? novela.precio : 0);
      }, 0);
 
      const tienesFisico = items.some((i: any) => i.esFisico);
      const total        = subtotal + (tienesFisico ? COSTO_ENVIO : 0);
 
      const subject = items.map((i: any) => {
        const novela = catalogoNovelas[i.id];
        return novela ? `${novela.titulo} (${i.tipo})` : '';
      }).join(', ');
 
      const commerceOrder = 'orden_' + Date.now();
      ordenes.set(commerceOrder, { items, total, email, nombre, telefono, entrega, tienesFisico });
 
      const params: any = {
        apiKey,
        commerceOrder,
        subject,
        currency: 'CLP',
        amount:   total,
        email,
        urlConfirmation: `${baseUrl}/confirmacion`,
        urlReturn:       `${baseUrl}/pagoConfirmado`,
      };
 
      const firma = firmar(params, secretKey);
      params.s = firma;
 
      const response = await axios.post(
        `${flowBaseUrl}/payment/create`,
        new URLSearchParams(params).toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
 
      res.json(response.data);
    } catch (error: any) {
      console.log('❌ ERROR CREAR PAGO:', error.response?.data || error.message);
      res.status(500).send('Error al crear el pago');
    }
  }
);
 
// ══════════════════════════════════════════════════
// RUTA — Confirmación Flow (webhook)
// ══════════════════════════════════════════════════
app.post('/confirmacion',
  express.json(),
  express.urlencoded({ extended: true }),
  async (req, res) => {
    console.log('📨 Flow llamó a /confirmacion');
    res.send('OK');
 
    try {
      const token = req.body.token;
 
      const params: any = { apiKey, token };
      const firma = firmar(params, secretKey);
      params.s = firma;
 
      const response = await axios.get(
        `${flowBaseUrl}/payment/getStatus`,
        { params }
      );
 
      const estadoPago = response.data;
      console.log('🔔 Confirmación recibida:', estadoPago);
 
      if (estadoPago.status === 2) {
        console.log('✅ PAGO APROBADO');
 
        const orden = ordenes.get(estadoPago.commerceOrder);
 
        if (orden) {
          const itemsDetalle = orden.items.map((i: any) => ({
            titulo: catalogoNovelas[i.id]?.titulo || `Producto #${i.id}`,
            tipo:   i.tipo,
          }));
 
          await resend.emails.send({
            from:    'Tienda <onboarding@resend.dev>',
            to:      [resendEmail],
            subject: `🌸 Nueva compra — ${orden.nombre}`,
            html:    correoCompra(
              orden.nombre,
              orden.telefono || 'No ingresado',
              orden.email,
              itemsDetalle,
              orden.total,
              orden.entrega,
              orden.tienesFisico
            ),
          });
 
          console.log('📧 Correo de compra enviado');
          ordenes.delete(estadoPago.commerceOrder);
        } else {
          console.log('⚠️ Orden no encontrada en memoria:', estadoPago.commerceOrder);
        }
      }
 
    } catch (error: any) {
      console.log('❌ ERROR CONFIRMACION:', error.response?.data || error.message);
    }
  }
);
 
// ══════════════════════════════════════════════════
// RUTA — Estado pago (consulta desde frontend)
// ══════════════════════════════════════════════════
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
 
// ══════════════════════════════════════════════════
// RUTA — Redirect tras pago Flow
// ══════════════════════════════════════════════════
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
  }
);
 
// ══════════════════════════════════════════════════
// Archivos estáticos + Angular SSR
// ══════════════════════════════════════════════════
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);
 
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});
 
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) throw error;
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}
 
export const reqHandler = createNodeRequestHandler(app);