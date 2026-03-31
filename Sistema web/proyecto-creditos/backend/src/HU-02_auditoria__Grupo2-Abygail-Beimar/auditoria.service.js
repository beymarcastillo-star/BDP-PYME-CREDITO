// ============================================================
//  auditoria.service.js — Lógica de Negocio de Auditoría
//  HU-02 · Grupo 2 — Abygail & Beymar
//  Proyecto: Plataforma Crediticia BDP S.A.M.
// ============================================================

const model = require('./auditoria.model');

// Acciones válidas del sistema
const ACCIONES_VALIDAS = [
  'LOGIN', 'LOGOUT',
  'INSERT', 'UPDATE', 'DELETE',
  'EXPORT', 'VIEW', 'ERROR',
];

// ------------------------------------------------------------
//  Registrar una acción en el log de auditoría
//  (Se llama desde CUALQUIER otro módulo del sistema)
// ------------------------------------------------------------
const registrarAccion = async (datos) => {
  // Validaciones
  if (!datos.usuario_id)    throw new Error('usuario_id es requerido');
  if (!datos.usuario_nombre) throw new Error('usuario_nombre es requerido');
  if (!datos.accion)        throw new Error('accion es requerida');
  if (!datos.modulo)        throw new Error('modulo es requerido');
  if (!datos.descripcion)   throw new Error('descripcion es requerida');

  if (!ACCIONES_VALIDAS.includes(datos.accion.toUpperCase())) {
    throw new Error(`Acción inválida: ${datos.accion}. Válidas: ${ACCIONES_VALIDAS.join(', ')}`);
  }

  const registro = await model.insertarLog({
    ...datos,
    accion: datos.accion.toUpperCase(),
  });

  return {
    ok:      true,
    mensaje: 'Acción registrada correctamente en el log WORM',
    id:      registro.id,
    hash:    registro.hash_integridad,
  };
};

// ------------------------------------------------------------
//  Consultar logs con filtros y paginación
// ------------------------------------------------------------
const consultarLogs = async (filtros) => {
  const pagina    = parseInt(filtros.pagina)    || 1;
  const por_pagina = parseInt(filtros.por_pagina) || 20;

  if (pagina < 1)     throw new Error('La página debe ser mayor a 0');
  if (por_pagina > 100) throw new Error('Máximo 100 registros por página');

  const resultado = await model.obtenerLogs({
    fecha_desde:  filtros.fecha_desde  || null,
    fecha_hasta:  filtros.fecha_hasta  || null,
    accion:       filtros.accion       || null,
    usuario_id:   filtros.usuario_id   || null,
    modulo:       filtros.modulo       || null,
    pagina,
    por_pagina,
  });

  return {
    ok:        true,
    ...resultado,
    acciones_disponibles: ACCIONES_VALIDAS,
  };
};

// ------------------------------------------------------------
//  Obtener resumen estadístico para el dashboard
// ------------------------------------------------------------
const obtenerResumen = async () => {
  const resumen = await model.obtenerResumen();
  return {
    ok: true,
    resumen: {
      total_hoy:         parseInt(resumen.total_hoy)         || 0,
      usuarios_activos:  parseInt(resumen.usuarios_activos)  || 0,
      acciones_criticas: parseInt(resumen.acciones_criticas) || 0,
      ultimo_registro:   resumen.ultimo_registro             || null,
    },
  };
};

// ------------------------------------------------------------
//  Middleware: registrar automáticamente cada request HTTP
//  Se puede usar en app.js como middleware global
// ------------------------------------------------------------
const middlewareAuditoria = (req, res, next) => {
  // Solo registra si el usuario está autenticado
  if (!req.user) return next();

  // No registrar las consultas al propio log de auditoría
  if (req.path.includes('/auditoria')) return next();

  const accion = {
    GET:    'VIEW',
    POST:   'INSERT',
    PUT:    'UPDATE',
    PATCH:  'UPDATE',
    DELETE: 'DELETE',
  }[req.method] || 'VIEW';

  model.insertarLog({
    usuario_id:    req.user.id       || 'desconocido',
    usuario_nombre: req.user.nombre  || 'desconocido',
    accion,
    modulo:        req.path,
    descripcion:   `${req.method} ${req.path}`,
    ip_origen:     req.ip || req.headers['x-forwarded-for'],
    user_agent:    req.headers['user-agent'],
  }).catch(err => {
    // El log nunca debe interrumpir el flujo principal
    console.error('[HU-02] Error en middleware de auditoría:', err.message);
  });

  next();
};

module.exports = {
  registrarAccion,
  consultarLogs,
  obtenerResumen,
  middlewareAuditoria,
};