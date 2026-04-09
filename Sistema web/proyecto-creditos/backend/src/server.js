import express from 'express';
import cors from 'cors';
import auditoriaRoutes from './HU-02_auditoria__Grupo2-Abygail-Beimar/auditoria.routes.js';
import { inicializarTabla } from './HU-02_auditoria__Grupo2-Abygail-Beimar/auditoria.model.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

app.use('/api/auditoria', auditoriaRoutes);

app.get('/', (_req, res) => {
  res.json({ mensaje: '✅ Backend funcionando', version: '1.0.0' });
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

inicializarTabla()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[DB] ❌ Error inicializando tabla:', err.message);
    process.exit(1);
  });