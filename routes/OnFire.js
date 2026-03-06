const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // Ruta para recibir datos de la ESP32: POST https://tu-app.onrender.com/Onfire/add
  router.post("/add", async (req, res) => {
    try {
      // Desestructuración del JSON enviado por la ESP32
      const { 
        fecha, temp, hum, flama, id_sensor, 
        lat, long, monoxido, co2_random, 
        viento_vel, viento_dir 
      } = req.body;

      // Guardar en la colección "Registros_Onfire"
      const docRef = await db.collection("Sensor").add({
        fecha,
        temp,
        hum,
        flama,
        id_sensor,
        lat, 
        long,
        monoxido,
        co2_random,
        viento_vel,
        viento_dir,
      });

      res.json({ status: "success", id: docRef.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Ruta para visualizar los datos guardados
  router.get("/ver", async (req, res) => {
    try {
      const items = await db.collection("Sensor").get();
      const registros = items.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      res.json(registros);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};