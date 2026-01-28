import pool from "./db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const d = req.body;
  if (!d.capital) return res.status(400).json({ error: "Faltan datos" });

  try {
    // Crear tabla si no existe
    await pool.query(`
      CREATE TABLE IF NOT EXISTS calculo_semanal (
        id INT AUTO_INCREMENT PRIMARY KEY,
        capital DECIMAL(10,2) NOT NULL,
        vino DECIMAL(10,2),
        naranja DECIMAL(10,2),
        azucar DECIMAL(10,2),
        pina DECIMAL(10,2),
        botella DECIMAL(10,2),
        total_insumos DECIMAL(10,2),
        ganancia DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insertar datos
    const sql = `
      INSERT INTO calculo_semanal
      (capital, vino, naranja, azucar, pina, botella, total_insumos, ganancia)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(sql, [
      d.capital,
      d.vino || 0,
      d.naranja || 0,
      d.azucar || 0,
      d.pina || 0,
      d.botella || 0,
      d.total_insumos || 0,
      d.ganancia || 0
    ]);

    res.status(200).json({ mensaje: "Guardado correctamente" });

  } catch (err) {
    console.error("❌ Error en guardar.js:", err);
    res.status(500).json({ error: "Error al guardar los datos" });
  }
}
