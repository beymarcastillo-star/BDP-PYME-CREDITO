# Plataforma Virtual para la Digitalización del Proceso Crediticio Pyme y Banca Empresa

## 1. Resumen Ejecutivo

### 1.1 Ficha del Proyecto

| **Concepto** | **Descripción** |
|--------|-------------|
| **Nombre del Proyecto** | CONSULTORÍA PARA LA PROVISIÓN DE SOFTWARE PARA PYME Y BE |
| **Problema a Resolver** | El Banco de Desarrollo Productivo (BDP S.A.M.) presenta un proceso crediticio para Pyme y Banca Empresa que requiere mayor agilidad, eficiencia y digitalización. Actualmente, el proceso implica múltiples formularios físicos, evaluaciones manuales y tiempos prolongados de análisis, lo que genera demoras en la aprobación de créditos, mayor carga operativa y una limitada trazabilidad de la información. Además, se necesita integrar herramientas tecnológicas como scoring crediticio, monitoreo de transacciones y conexión con el sistema CORE bancario, garantizando seguridad, confidencialidad y cumplimiento normativo. |
| **Objetivo Principal** | Desarrollar e implementar una plataforma virtual que digitalice y optimice el proceso crediticio para Pyme y Banca Empresa del BDP S.A.M., permitiendo una gestión más ágil, segura y eficiente, integrada al sistema CORE del banco y alineada a las tendencias tecnológicas actuales. |


### 1.2 Matriz de Stakeholders

| **Rol** | **Nombre/Cargo** | **Nivel de Influencia** | **Expectativa Principal** |
|--------|----------------|------------------------|---------------------------|
| Cliente / Patrocinador | Alta Gerencia del BDP S.A.M. | Alto | Que el proyecto se implemente en el plazo establecido, dentro del presupuesto y que mejore radicalmente la eficiencia del proceso crediticio. |
| Usuario Final | Analistas de crédito y Funcionarios | Medio | Contar con una plataforma fácil de usar que agilice la evaluación, reduzca la carga operativa manual y evite el uso de hojas de cálculo externas. |
| Equipo Técnico | Miguel Angel Chura Condori (Gestor de Pilas) <br> Norma Mendoza Layme (Dev) <br> Nicole Abigail Arratia Chipana (Dev) <br> Roger Huarachi Rojas (Dev) <br> Kevin Jhonatan Rocha (Dev) <br> Beymar Castillo Cordova (Dev) | Alto | Contar con requerimientos claros, acceso a los ambientes de prueba a tiempo, y entregar un software de alta calidad que cumpla con el cronograma. |


## 2. Antecedentes y Problema (El "Por qué")

**Contexto:** El BDP S.A.M. es una sociedad de economía mixta que funciona como un banco de primer y segundo piso. El proyecto está enfocado en el área crediticia productiva.  

**Problema actual:** El proceso crediticio requiere mayor agilidad para evitar cuellos de botella operativos en las agencias.

### 2.1 La Complejidad del Sector Productivo

- **El Ciclo de Vida (Pecuario):** El software debe proyectar el desarrollo del hato ganadero (nacimientos, recría, engorde, venta) para automatizar el cálculo de ingresos.  
- **La Estacionalidad (Agrícola):** El sistema debe permitir simulación mediante supuestos (precio de soya, rendimiento por hectárea).  
- **Gestión de Garantías:** Conexión dinámica entre valor de garantías y capacidad de pago.

### 2.2 Riesgos de un Software Genérico

- Riesgos de crédito  
- Cuellos de botella operativos  

**Triple Impacto:**
- El productor recibe el crédito a tiempo  
- El banco asegura su cartera  
- El país produce más alimentos  


## 3. Alcance del Proyecto (El "Qué")

**Funcionalidades principales:**

- Registro inicial único de datos  
- Checklists inteligentes  
- Calculadoras automatizadas  
- Generación de reportes ejecutivos  
- Selector dinámico de perfil  

**Restricción de Alcance:**  
No se desarrollará aplicación móvil nativa independiente.

## 4. Requerimientos Funcionales y Técnicos

### 4.1 Requerimientos Funcionales

| **ID** | **Descripción** | **Prioridad** |
|------|-------------|------------|
| RF-01 | Login seguro y roles | Must |
| RF-02 | Gestión de formularios | Must |
| RF-03 | Evaluación financiera | Must |
| RF-04 | Evaluación sectorial | Should |
| RF-05 | Generación automática de evaluaciones | Must |
| RF-06 | Integración API CORE | Must |
| RF-07 | Reportes PDF y Excel | Must |
| RF-08 | Logs de auditoría | Must |
| RF-09 | Gestión de permisos RBAC | Must |
| RF-10 | Almacenamiento seguro | Must |
| RF-11 | Scoring automático | Should |
| RF-12 | Monitoreo en tiempo real | Should |


### 4.2 Requerimientos No Funcionales

| **ID** | **Categoría** | **Descripción** |
|------|-------------|-------------|
| RNF-01 | Offline-First | Funcionamiento sin internet |
| RNF-02 | Escalabilidad | Soporte 500 usuarios |
| RNF-03 | Parametrización | Motor de reglas dinámico |
| RNF-04 | Integración | API segura |
| RNF-05 | Seguridad | Cifrado + WORM |


## 5. Estrategia de Implementación

- Metodologías ágiles  
- Capacitación en Sandbox  
- Control de cambios por ambientes  


## 6. Propiedad y Confidencialidad

- Código fuente propiedad del BDP  
- Información confidencial  


## 7. Cronograma

- Fase 1: 40 días  
- Fase 2: 140 días  
- Fase 3: 240 días  
- Fase 4: 260 días  


## 8. Presupuesto

| **Hito** | **Monto (Bs.)** | **%** |
|--------|---------------|------|
| Firma contrato | 100.000 | 20% |
| Entrega 2 | 175.000 | 35% |
| Entrega 4 | 125.000 | 25% |
| Entrega 5 | 100.000 | 20% |
| **TOTAL** | **500.000** | **100%** |
