const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors()); // Permite que Vercel acceda al backend
app.use(express.json()); // Permite recibir JSON
app.use(express.static(path.join(__dirname, "Diseño"))); // Carpeta del frontend

// 🔹 Conexión a MySQL en Railway
const db = mysql.createConnection({
  host: "shinkansen.proxy.rlwy.net",          // Host de Railway
  user: "root",                               // Usuario de Railway
  password: "LVHvvPJeGQlpsowMbTWdDPDCNxdcocvr", // Contraseña
  database: "railway",                        // Nombre de la base
  port: 25065                                 // Puerto de Railway
});

// Probar conexión
db.connect(err => {
  if (err) {
    console.error("❌ Error al conectar con MySQL en Railway:", err);
    return;
  }
  console.log("✅ Conectado correctamente a MySQL en Railway!");
});

// 🔹 Ruta para guardar datos
app.post("/guardar", (req, res) => {
  const d = req.body;

  // Verificación básica
  if (!d.capital) return res.status(400).json({ error: "Faltan datos" });

  const sql = `
    INSERT INTO calculo_semanal
    (capital, vino, naranja, azucar, pina, botella, total_insumos, ganancia)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    d.capital,
    d.vino,
    d.naranja,
    d.azucar,
    d.pina,
    d.botella,
    d.total_insumos,
    d.ganancia
  ], err => {
    if (err) {
      console.error("❌ Error al guardar en MySQL:", err);
      return res.status(500).json({ error: err });
    }
    console.log("💾 Datos guardados correctamente:", d);
    res.json({ mensaje: "Guardado correctamente" });
  });
});

// 🔹 Nueva ruta para ver datos guardados
app.get("/datos", (req, res) => {
  const sql = "SELECT * FROM calculo_semanal ORDER BY id DESC"; // Ordenar por último ingresado
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener datos:", err);
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// 🔹 Puerto dinámico para Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en puerto ${PORT}`);
  console.log(`🔗 Ver los datos en: http://localhost:${PORT}/datos`);
});
