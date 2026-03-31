// ============================================================
//  auditoria.controller.js — Controlador HTTP de Auditoría
//  HU-02 · Grupo 2 — Abygail & Beymar
//  Proyecto: Plataforma Crediticia BDP S.A.M.
// ============================================================

const service = require('./auditoria.service');

// ------------------------------------------------------------
//  GET /api/auditoria
//  Obtener logs con filtros opcionales y paginación
// ------------------------------------------------------------
const getLogs = async (req, res) => {
  try {
    const resultado = await service.consultarLogs(req.query);
    return res.status(200).json(resultado);
  } catch (err) {
    console.error('[HU-02] Error en getLogs:', err.message);
    return res.status(400).json({
      ok:     false,
      error:  err.message,
    });
  }
};

// ------------------------------------------------------------
//  GET /api/auditoria/resumen
//  Obtener estadísticas del día para el dashboard
// ------------------------------------------------------------
const getResumen = async (req, res) => {
  try {
    const resultado = await service.obtenerResumen();
    return res.status(200).json(resultado);
  } catch (err) {
    console.error('[HU-02] Error en getResumen:', err.message);
    return res.status(500).json({
      ok:    false,
      error: err.message,
    });
  }
};

// ------------------------------------------------------------
//  POST /api/auditoria
//  Registrar manualmente una acción en el log
//  (Normalmente se usa el middleware, pero este endpoint
//   permite registros manuales desde otros módulos)
// ------------------------------------------------------------
const postLog = async (req, res) => {
  try {
    const resultado = await service.registrarAccion({
      ...req.body,
      ip_origen:  req.ip || req.headers['x-forwarded-for'],
      user_agent: req.headers['user-agent'],
    });
    return res.status(201).json(resultado);
  } catch (err) {
    console.error('[HU-02] Error en postLog:', err.message);
    return res.status(400).json({
      ok:    false,
      error: err.message,
    });
  }
};

// ------------------------------------------------------------
//  DELETE /api/auditoria/:id  →  BLOQUEADO (WORM)
//  PUT    /api/auditoria/:id  →  BLOQUEADO (WORM)
// ------------------------------------------------------------
const operacionBloqueada = (req, res) => {
  return res.status(403).json({
    ok:     false,
    error:  '[WORM] Operación no permitida. Los registros de auditoría son inalterables.',
    norma:  'RF-08 / RNF-05 — BDP S.A.M.',
  });
};

module.exports = {
  getLogs,
  getResumen,
  postLog,
  operacionBloqueada,
};