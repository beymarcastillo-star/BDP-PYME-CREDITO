import { insertarLog, obtenerLogs, obtenerResumen as resumenDB } from './auditoria.model.js';

const ACCIONES_VALIDAS = ['LOGIN','LOGOUT','INSERT','UPDATE','DELETE','EXPORT','VIEW','ERROR'];

export const registrarAccion = async (datos) => {
  if (!datos.usuario_id)     throw new Error('usuario_id es requerido');
  if (!datos.usuario_nombre) throw new Error('usuario_nombre es requerido');
  if (!datos.accion)         throw new Error('accion es requerida');
  if (!datos.modulo)         throw new Error('modulo es requerido');
  if (!datos.descripcion)    throw new Error('descripcion es requerida');
  if (!ACCIONES_VALIDAS.includes(datos.accion.toUpperCase()))
    throw new Error(`Acción inválida: ${datos.accion}`);

  const registro = await insertarLog({ ...datos, accion: datos.accion.toUpperCase() });
  return { ok: true, mensaje: 'Acción registrada', id: registro.id, hash: registro.hash_integridad };
};

export const consultarLogs = async (filtros) => {
  const pagina     = parseInt(filtros.pagina)     || 1;
  const por_pagina = parseInt(filtros.por_pagina) || 20;
  if (pagina < 1)       throw new Error('La página debe ser mayor a 0');
  if (por_pagina > 100) throw new Error('Máximo 100 registros por página');
  const resultado = await obtenerLogs({
    fecha_desde: filtros.fecha_desde || null,
    fecha_hasta: filtros.fecha_hasta || null,
    accion:      filtros.accion      || null,
    usuario_id:  filtros.usuario_id  || null,
    modulo:      filtros.modulo      || null,
    pagina, por_pagina,
  });
  return { ok: true, ...resultado };
};

export const obtenerResumen = async () => {
  const resumen = await resumenDB();
  return {
    ok: true,
    resumen: {
      total_hoy:         parseInt(resumen.total_hoy)         || 0,
      usuarios_activos:  parseInt(resumen.usuarios_activos)  || 0,
      acciones_criticas: parseInt(resumen.acciones_criticas) || 0,
      ultimo_registro:   resumen.ultimo_registro             || null,
    },
  };
}