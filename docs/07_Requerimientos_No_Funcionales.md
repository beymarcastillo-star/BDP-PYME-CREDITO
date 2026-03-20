# 7. Top 5 Requerimientos No Funcionales (RNF Clave)

| ID     | Categoría        | Descripción Técnica                                                                 | Métrica de Éxito                                              |
|--------|------------------|--------------------------------------------------------------------------------------|---------------------------------------------------------------|
| RNF-01 | Offline-First    | Operación continua en campo sin conexión y sincronización posterior.               | Funcionamiento sin internet mediante IndexedDB/PWA.           |
| RNF-02 | Escalabilidad    | Arquitectura modular en PostgreSQL y entrega de código fuente.                     | Soporte mínimo de 500 usuarios concurrentes.                  |
| RNF-03 | Parametrización  | Motor de reglas para configurar tasas y flujos dinámicamente.                      | Cambios aplicados sin reprogramar código fuente.              |
| RNF-04 | Integración      | Comunicación segura vía API-REST (JWT, JSON, HATEOAS).                              | Intercambio validado con el Core Bancario.                    |
| RNF-05 | Seguridad Total  | Cifrado de contraseñas (bcrypt/Argon2) y protección WORM.                          | Logs 100% inalterables para control auditor.                  |
