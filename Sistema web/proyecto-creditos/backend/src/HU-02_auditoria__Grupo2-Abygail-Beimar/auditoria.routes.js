import { Router } from 'express';
import { getLogs, getResumen, postLog, operacionBloqueada } from './auditoria.controller.js';

const router = Router();

router.get('/',        getLogs);
router.get('/resumen', getResumen);
router.post('/',       postLog);
router.put('/:id',     operacionBloqueada);
router.patch('/:id',   operacionBloqueada);
router.delete('/:id',  operacionBloqueada);

export default router;