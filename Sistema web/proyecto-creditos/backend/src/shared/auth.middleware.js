// ============================================================
//  auth.middleware.js — Autenticación JWT compartida
//  Proyecto: Plataforma Crediticia BDP S.A.M.
// ============================================================

const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'bdp_secret_2026';

// Verifica que el token JWT sea válido
const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      ok:    false,
      error: 'Token requerido. Inicia sesión primero.',
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      ok:    false,
      error: 'Token inválido o expirado.',
    });
  }
};

// Verifica que el usuario tenga uno de los roles permitidos
const soloRoles = (rolesPermitidos) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ ok: false, error: 'No autenticado' });
  }
  if (!rolesPermitidos.includes(req.user.rol)) {
    return res.status(403).json({
      ok:    false,
      error: `Acceso denegado. Se requiere uno de estos roles: ${rolesPermitidos.join(', ')}`,
    });
  }
  next();
};

module.exports = { verificarToken, soloRoles };