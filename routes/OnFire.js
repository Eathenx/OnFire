const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // Ruta para recibir datos de la ESP32: POST https://tu-app.onrender.com/Onfire/add
  router.post("/add", async (req, res) => {
    try {
      // Extraemos exactamente los campos que envía tu ESP32
      const { 
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
        viento_dir 
      } = req.body;

      // Guardamos en la colección "Onfire_Logs" (o la que prefieras)
      const docRef = await db.collection("Sensor").add({
        fecha,
        temp,
        hum,
        flama,
        id_sensor,
        lat: lat,
        long: long,
        monoxido,
        co2_random,
        viento_vel,
        viento_dir,
        recibido_el: new Date().toISOString() // Marca de tiempo del servidor
      });

      console.log(`Datos recibidos del sensor ${id_sensor}. ID Documento: ${docRef.id}`);
      res.json({ status: "success", id: docRef.id });
    } catch (error) {
      console.error("Error al procesar datos de ESP32:", error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // Ruta para visualizar los datos guardados
  router.get("/ver", async (req, res) => {
    try {
      const items = await db.collection("Sensor").orderBy("recibido_el", "desc").get();
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