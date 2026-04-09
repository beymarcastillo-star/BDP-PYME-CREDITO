import pool from '../shared/db.config.js';
import crypto from 'crypto';

export const inicializarTabla = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS auditoria_log (
      id               BIGSERIAL    PRIMARY KEY,
      usuario_id       VARCHAR(100) NOT NULL,
      usuario_nombre   VARCHAR(150) NOT NULL,
      accion           VARCHAR(50)  NOT NULL,
      modulo           VARCHAR(100) NOT NULL,
      descripcion      TEXT         NOT NULL,
      ip_origen        VARCHAR(45),
      user_agent       TEXT,
      datos_antes      JSONB,
      datos_despues    JSONB,
      hash_integridad  VARCHAR(64)  NOT NULL,
      fecha_hora       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_auditoria_fecha   ON auditoria_log (fecha_hora DESC);
    CREATE INDEX IF NOT EXISTS idx_auditoria_usuario ON auditoria_log (usuario_id);
    CREATE INDEX IF NOT EXISTS idx_auditoria_accion  ON auditoria_log (accion);
  `);
  console.log('[HU-02] ✅ Tabla auditoria_log lista');
};

const generarHash = (datos) => {
  const contenido = JSON.stringify({
    usuario_id:  datos.usuario_id,
    accion:      datos.accion,
    modulo:      datos.modulo,
    descripcion: datos.descripcion,
    ip_origen:   datos.ip_origen,
    fecha_hora:  datos.fecha_hora || new Date().toISOString(),
  });
  return crypto.createHash('sha256').update(contenido).digest('hex');
};

export const insertarLog = async ({ usuario_id, usuario_nombre, accion, modulo, descripcion, ip_origen = null, user_agent = null, datos_antes = null, datos_despues = null }) => {
  const fecha_hora = new Date().toISOString();
  const hash_integridad = generarHash({ usuario_id, accion, modulo, descripcion, ip_origen, fecha_hora });
  const SQL = `
    INSERT INTO auditoria_log
      (usuario_id, usuario_nombre, accion, modulo, descripcion, ip_origen, user_agent, datos_antes, datos_despues, hash_integridad, fecha_hora)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *;
  `;
  const { rows } = await pool.query(SQL, [usuario_id, usuario_nombre, accion, modulo, descripcion, ip_origen, user_agent, datos_antes ? JSON.stringify(datos_antes) : null, datos_despues ? JSON.stringify(datos_despues) : null, hash_integridad, fecha_hora]);
  return rows[0];
};

export const obtenerLogs = async ({ fecha_desde, fecha_hasta, accion, usuario_id, modulo, pagina = 1, por_pagina = 20 }) => {
  const condiciones = [], valores = [];
  let idx = 1;
  if (fecha_desde) { condiciones.push(`fecha_hora >= $${idx++}`); valores.push(fecha_desde); }
  if (fecha_hasta) { condiciones.push(`fecha_hora <= $${idx++}`); valores.push(fecha_hasta); }
  if (accion)      { condiciones.push(`accion = $${idx++}`);      valores.push(accion.toUpperCase()); }
  if (usuario_id)  { condiciones.push(`usuario_id ILIKE $${idx++}`); valores.push(`%${usuario_id}%`); }
  if (modulo)      { condiciones.push(`modulo ILIKE $${idx++}`);  valores.push(`%${modulo}%`); }
  const WHERE = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';
  const offset = (pagina - 1) * por_pagina;
  valores.push(por_pagina, offset);
  const [{ rows: logs }, { rows: conteo }] = await Promise.all([
    pool.query(`SELECT * FROM auditoria_log ${WHERE} ORDER BY fecha_hora DESC LIMIT $${idx} OFFSET $${idx+1}`, valores),
    pool.query(`SELECT COUNT(*) as total FROM auditoria_log ${WHERE}`, valores.slice(0, -2)),
  ]);
  return { logs, total: parseInt(conteo[0].total), pagina, por_pagina, paginas: Math.ceil(conteo[0].total / por_pagina) };
};

export const obtenerResumen = async () => {
  const { rows } = await pool.query(`
    SELECT
      COUNT(*)                                      AS total_hoy,
      COUNT(DISTINCT usuario_id)                    AS usuarios_activos,
      COUNT(*) FILTER (WHERE accion = 'DELETE')     AS acciones_criticas,
      MAX(fecha_hora)                               AS ultimo_registro
    FROM auditoria_log WHERE fecha_hora >= CURRENT_DATE;
  `);
  return rows[0];
}