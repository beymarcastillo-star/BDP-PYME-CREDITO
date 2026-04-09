// ============================================================
//  auditoria.api.js — Llamadas al backend de Auditoría
//  HU-02 · Grupo 2 — Abygail & Beymar
//  Proyecto: Plataforma Crediticia BDP S.A.M.
// ============================================================

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Obtener token JWT del localStorage
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('bdp_token') || ''}`,
});

// ------------------------------------------------------------
//  Obtener logs con filtros y paginación
// ------------------------------------------------------------
export const fetchLogs = async (filtros = {}) => {
  const params = new URLSearchParams();
  if (filtros.fecha_desde)  params.append('fecha_desde',  filtros.fecha_desde);
  if (filtros.fecha_hasta)  params.append('fecha_hasta',  filtros.fecha_hasta);
  if (filtros.accion)       params.append('accion',       filtros.accion);
  if (filtros.usuario_id)   params.append('usuario_id',   filtros.usuario_id);
  if (filtros.modulo)       params.append('modulo',       filtros.modulo);
  if (filtros.pagina)       params.append('pagina',       filtros.pagina);
  if (filtros.por_pagina)   params.append('por_pagina',   filtros.por_pagina);

  const res = await fetch(`${BASE_URL}/api/auditoria?${params}`, {
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
};

// ------------------------------------------------------------
//  Obtener resumen estadístico para el dashboard
// ------------------------------------------------------------
export const fetchResumen = async () => {
  const res = await fetch(`${BASE_URL}/api/auditoria/resumen`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
};

// ------------------------------------------------------------
//  Exportar logs a CSV (descarga directa)
// ------------------------------------------------------------
export const exportarCSV = async (filtros = {}) => {
  const params = new URLSearchParams({ ...filtros, formato: 'csv' });
  const res = await fetch(`${BASE_URL}/api/auditoria/export?${params}`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Error al exportar CSV');

  const blob = await res.blob();
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `auditoria_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};