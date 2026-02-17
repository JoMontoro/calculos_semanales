import supabase from "./supabaseClient";

export default async function handler(req, res) {
  // CORS: permitir tu frontend (o "*" mientras pruebas)
  res.setHeader("Access-Control-Allow-Origin", "https://frontcalculos.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Responder preflight
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "PUT") return res.status(405).json({ error: "Método no permitido" });

  try {
    const d = req.body;
    const { data, error } = await supabase
      .from("sangrias")
      .update({
        fecha: d.fecha,
        cantidad: d.cantidad,
        precio: d.precio,
        cliente: d.cliente,
        estado: d.estado,
        notas: d.notas,
        total: d.total
      })
      .eq("id", d.id)
      .select()
      .single();

    if (error) throw error;
    return res.status(200).json({ ok: true, data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}