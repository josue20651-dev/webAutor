require('dotenv').config()
const express = require("express");
const firmar = require("./utils/firma");
const app = express();
const axios = require("axios")
const apiKey = process.env.FLOW_API_KEY
const secretKey = process.env.FLOW_SECRET_KEY
<<<<<<< HEAD
const flowBaseUrl = process.env.FLOW_BASE_URL
const baseUrl = process.env.BASE_URL
=======
>>>>>>> 4599050 (Cambios visuales y pestaña Obras)
const cors = require("cors");


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
    console.log("Servidor corriendo")
})

app.post("/crear-pago", async (req, res) => {
  try {

    const {nombre, precio, email} =req.body;

    const params = {
      apiKey: apiKey,
      commerceOrder: "orden_" + Date.now(),
      subject: nombre,
      currency: "CLP",
      amount: precio,
      email: email,
      urlConfirmation:
<<<<<<< HEAD
        `${baseUrl}/confirmacion`,
      urlReturn: `${baseUrl}`
=======
        "https://melody-unpranked-incandescently.ngrok-free.dev/confirmacion",
      urlReturn: "http://localhost:4200/"
>>>>>>> 4599050 (Cambios visuales y pestaña Obras)
    };

    const firma = firmar(params, secretKey);
    params.s = firma;

    const response = await axios.post(
<<<<<<< HEAD
      `${flowBaseUrl}/payment/create`,
=======
      "https://sandbox.flow.cl/api/payment/create",
>>>>>>> 4599050 (Cambios visuales y pestaña Obras)
      new URLSearchParams(params).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    res.json(response.data);

  } catch (error) {
    console.log("❌ ERROR CREAR PAGO:");
    console.log(error.response?.data || error.message);
    res.status(500).send("Error al crear el pago");
  }
});

app.post("/confirmacion", async (req, res) => {
  console.log("BODY FLOW:", req.body);
  try {
    const token = req.body.token;

    const params = {
      apiKey: apiKey,
      token: token
    };

    const firma = firmar(params, secretKey);
    params.s = firma;

    const response = await axios.get(
<<<<<<< HEAD
      `${flowBaseUrl}/payment/getStatus`,
=======
      "https://sandbox.flow.cl/api/payment/getStatus",
>>>>>>> 4599050 (Cambios visuales y pestaña Obras)
      { params }
    );

    const estadoPago = response.data;

    console.log("🔔 Confirmación recibida");
    console.log(estadoPago);

    if (estadoPago.status === 2) {
      console.log("✅ PAGO APROBADO");
    }

    res.send("OK");

  } catch (error) {
    console.log("❌ ERROR CONFIRMACION:");
    console.log(error.response?.data || error.message);
    res.status(500).send("Error en confirmación");
  }
});
