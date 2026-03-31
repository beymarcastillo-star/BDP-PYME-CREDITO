// ============================================================
//  auditoria.routes.js — Rutas REST de Auditoría
//  HU-02 · Grupo 2 — Abygail & Beymar
//  Proyecto: Plataforma Crediticia BDP S.A.M.
// ============================================================
//
//  Endpoints disponibles:
//
//  GET    /api/auditoria            → listar logs con filtros
//  GET    /api/auditoria/resumen    → estadísticas del dashboard
//  POST   /api/auditoria            → registrar acción manual
//  PUT    /api/auditoria/:id        → BLOQUEADO (WORM)
//  DELETE /api/auditoria/:id        → BLOQUEADO (WORM)
//
// ============================================================

const router     = require('express').Router();
const controller = require('./auditoria.controller');
const { verificarToken, soloRoles } = require('../shared/auth.middleware');

// ── Rutas públicas de solo lectura (requieren autenticación) ─
router.get(
  '/',
  verificarToken,
  soloRoles(['auditor', 'admin', 'gerencia']),
  controller.getLogs
);

router.get(
  '/resumen',
  verificarToken,
  soloRoles(['auditor', 'admin', 'gerencia']),
  controller.getResumen
);

// ── Registro manual de acción (solo sistemas internos) ──────
router.post(
  '/',
  verificarToken,
  soloRoles(['admin', 'sistema']),
  controller.postLog
);

// ── Operaciones BLOQUEADAS por protección WORM ──────────────
router.put(   '/:id', controller.operacionBloqueada);
router.patch( '/:id', controller.operacionBloqueada);
router.delete('/:id', controller.operacionBloqueada);

module.exports = router;