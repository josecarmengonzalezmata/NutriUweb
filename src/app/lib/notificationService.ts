// Servicio para notificar a pacientes sobre nuevos canjes vía backend
import { VITE_BACKEND_URL } from "@/app/config/env";

export async function notifyNewCanjeToPatients({
  pacienteId,
  titulo,
  mensaje,
  datosAdicionales,
}) {
  try {
    const response = await fetch(`${VITE_BACKEND_URL}/notifications/custom`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pacienteId,
        titulo,
        mensaje,
        datosAdicionales,
        tipo: "canje",
      }),
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}
