# 6. Requerimientos Funcionales y Técnicos (Basados en el DBC)

## 6.1. Top Requerimientos Funcionales (RF)

| ID     | Descripción del Requerimiento Funcional                                                                 | Prioridad / Criterio de Éxito                          |
|--------|----------------------------------------------------------------------------------------------------------|-------------------------------------------------------|
| RF-01  | El sistema debe validar credenciales de usuario (Login seguro y roles).                                 | Must / Acceso denegado tras 3 intentos.               |
| RF-02  | Gestión de formularios del proceso de crédito.                                                          | Must / Creación y consulta sin errores.               |
| RF-03  | Evaluación con Estados Financieros.                                                                     | Must Have / Registro y cálculo de datos financieros correctamente. |
| RF-04  | Evaluación productiva sectorial.                                                                        | Should Have / Generación correcta de análisis y reportes sectoriales. |
| RF-05  | Generación automática de evaluaciones financieras (flujo, balances, índices).                          | Must / Cálculos precisos y exportables.               |
| RF-06  | Integración vía API REST con el CORE bancario (formato JSON, JWT).                                      | Must / Comunicación exitosa con el CORE.              |
| RF-07  | Generación de reportes automáticos (PDF y Excel).                                                       | Must / Reportes sin pérdida de datos.                 |
| RF-08  | Registro de logs de auditoría para toda inserción, modificación y eliminación.                         | Must / Registro obligatorio e inalterable.            |
| RF-09  | Gestión de permisos mediante panel de selección por rol (RBAC).                                         | Must / Asignación sin afectar otros usuarios.         |
| RF-10  | Carga y almacenamiento seguro de archivos digitales adjuntos.                                           | Must / Almacenamiento en directorios protegidos.      |
| RF-11  | Automatización de calificación de riesgo (Scoring) por variables sectoriales.                          | Should / Generación de puntaje automático.            |
| RF-12  | Seguimiento y monitoreo en tiempo real de transacciones crediticias.                                    | Should / Visualización de estado y tiempos.           |
