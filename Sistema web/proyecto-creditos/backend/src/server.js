// server.js — Backend principal del proyecto
// Grupo 2: Abygail & Beimar  |  Proyecto Sistema de Créditos

import express from "express";
import cors from "cors";

// ── Rutas del Grupo 2 ──────────────────────────────────────────
import auditoriaRoutes  from "./src/HU-02_auditoria__Grupo2-Abygail-Beimar/auditoria.routes.js";
import hatoRoutes       from "./src/HU-05_hato-ganadero__Grupo2-Abygail-Beimar/hato.routes.js";
import coreRoutes       from "./src/HU-08_core-bancario__Grupo2-Abygail-Beimar/core.routes.js";

// ── Rutas del Grupo 1 (agregar cuando estén listas) ────────────
// import loginRoutes     from "./src/HU-01_login__Grupo1-Rojer-Kevin/login.routes.js";
// import checklistRoutes from "./src/HU-04_checklist-documentos__Grupo1-Rojer-Kevin/checklist.routes.js";
// import scoringRoutes   from "./src/HU-07_scoring-crediticio__Grupo1-Rojer-Kevin/scoring.routes.js";

// ── Rutas del Grupo 3 (agregar cuando estén listas) ────────────
// import cargaDocRoutes  from "./src/HU-03_carga-documentos__Grupo3-Norma-Miguel/cargadoc.routes.js";
// import simulacionRoutes from "./src/HU-06_simulacion-agricola__Grupo3-Norma-Miguel/simulacion.routes.js";
// import offlineRoutes   from "./src/HU-09_modo-offline__Grupo3-Norma-Miguel/offline.routes.js";
// import reportesRoutes  from "./src/HU-10_reportes__Grupo3-Norma-Miguel/reportes.routes.js";

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares ────────────────────────────────────────────────
app.use(cors());                  // permite peticiones del frontend
app.use(express.json());          // parsea JSON en el body

// ── Registro de peticiones (útil para ver qué llega) ──────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// ── Rutas activas ─────────────────────────────────────────────
app.use("/api/auditoria", auditoriaRoutes);
app.use("/api/hato",      hatoRoutes);
app.use("/api/core",      coreRoutes);

// ── Ruta de prueba (para verificar que el server corre) ───────
app.get("/", (_req, res) => {
  res.json({
    mensaje: "✅ Backend funcionando",
    version: "1.0.0",
    rutas: [
      "GET  /api/auditoria",
      "POST /api/auditoria",
      "POST /api/hato/calcular",
      "POST /api/core/sincronizar",
    ],
  });
});

// ── Manejo de rutas no encontradas ────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// ── Arrancar el servidor ──────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`   Presiona Ctrl+C para detenerlo`);
});
