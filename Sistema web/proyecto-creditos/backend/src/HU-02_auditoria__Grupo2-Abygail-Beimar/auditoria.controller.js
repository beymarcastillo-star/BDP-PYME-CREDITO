import { consultarLogs, obtenerResumen, registrarAccion } from './auditoria.service.js';

const getLogs = async (req, res) => {
  try {
    const resultado = await consultarLogs(req.query);
    return res.status(200).json(resultado);
  } catch (err) {
    return res.status(400).json({ ok: false, error: err.message });
  }
};

const getResumen = async (req, res) => {
  try {
    const resultado = await obtenerResumen();
    return res.status(200).json(resultado);
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};

const postLog = async (req, res) => {
  try {
    const resultado = await registrarAccion({
      ...req.body,
      ip_origen:  req.ip || req.headers['x-forwarded-for'],
      user_agent: req.headers['user-agent'],
    });
    return res.status(201).json(resultado);
  } catch (err) {
    return res.status(400).json({ ok: false, error: err.message });
  }
};

const operacionBloqueada = (req, res) => {
  return res.status(403).json({
    ok:    false,
    error: '[WORM] Operación no permitida. Los registros de auditoría son inalterables.',
    norma: 'RF-08 / RNF-05 — BDP S.A.M.',
  });
};

export { getLogs, getResumen, postLog, operacionBloqueada };