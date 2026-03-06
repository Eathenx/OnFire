const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json()); // Vital para leer el JSON de la ESP32

// Inicializar Firebase
const serviceAccount = require("./firebase-key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Redirección de la lógica de Alumnos.js a la ruta /Onfire
const OnfireRouter = require("./routes/OnFire")(db);
app.use("/Onfire", OnfireRouter); 

app.get("/", (req, res) => {
  res.send("Servidor Onfire activo para recepción de sensores.");
});

// Configuración obligatoria para Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});