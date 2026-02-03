import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://iqjcaitlesmuzpfyvjbx.supabase.co";
const supabaseKey = "sb_publishable_9Kqk8UyIV9EX7sv3159hiQ_5SEJHvkb";

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const d = req.body;

    const { data, error } = await supabase
      .from("calculo_semanal")
      .insert([
        {
          capital: d.capital,
          vino: d.vino,
          naranja: d.naranja,
          azucar: d.azucar,
          pina: d.pina,
          botella: d.botella,
          total_insumos: d.total,
          ganancia: d.ganancia
        }
      ]);

    if (error) throw error;

    return res.status(200).json({
      ok: true,
      mensaje: "Datos guardados en Supabase ✅",
      data
    });

  } catch (err) {
    console.error("ERROR:", err);
    return res.status(500).json({
      ok: false,
      error: err.message
    });
  }
}