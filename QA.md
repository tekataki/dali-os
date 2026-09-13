# DALI OS — Registro de verificación

Fecha de cierre de esta revisión: 13 de septiembre de 2026.

## Pruebas funcionales ejecutadas

Herramienta: navegador headless sobre `tests.html`, con la aplicación real en un iframe del mismo origen y almacenamiento QA aislado. No se utilizan servidores, paquetes instalados ni compilación.

**Último resultado: 39 correctas · 0 fallidas · 1 pendiente.**

Cobertura:
- Conversión y formato de MXN; precisión en centavos; rechazo de importes negativos o inválidos.
- Saldo de ingresos/gastos y exclusión de registros eliminados.
- Préstamos con abonos parciales; rechazo de sobrepagos.
- Idempotencia de cobros SOMA y vinculación/reversión financiera.
- Progreso ponderado y requisito de evidencia final.
- Edad dinámica y medianoche de America/Mexico_City.
- Renovación diaria, semanal, mensual y anual, historial y periodos sin visitas.
- Contrato JSON de bitácora y escape de HTML.
- Cancelar formularios sin guardar accidentalmente.
- Pad de dinero, creación y edición con UUID conservado.
- Objetivos recurrentes, archivo recuperable y restauración.
- Pagos pendientes, edición de cliente, entregables y normalización de teléfono.
- Sesión real de gimnasio con series y volumen.
- Actividad y sesión de estudio.
- Registro manual, lectura completa y conversión confirmada de pendiente de bitácora.
- Perfil, filtros de fecha/monto, búsqueda global y todas las rutas de módulos.
- Importación idempotente y rechazo de respaldo inválido sin modificar datos.
- Foto de prueba creada en canvas: carga, recorte, compresión, persistencia Blob e hidratación mediante URL blob.
- Tema y persistencia tras recargar la página.

El caso pendiente es **autenticación, RLS y protección de rutas**, que no están implementadas. No se cuenta como aprobado ni como una simulación de seguridad. La herramienta Hosted de acceso devolvió `membership_required`; no se guardaron reglas ni se desplegó la aplicación.

La consola de esta ejecución no registró errores de JavaScript. Esto demuestra que los flujos ejecutados pasan; no equivale a una certificación formal de HTML/CSS, seguridad o accesibilidad.

## Revisión visual de la aplicación real

Capturas tomadas mediante PlaywrightScreenshot, con viewport móvil o de escritorio según corresponde. El lanzador `review.html` prepara un namespace local de revisión y **redirige a `index.html`**; no simula un teléfono dentro de una página de escritorio.

| Página / estado | Viewport | Resultado observado | Evidencia |
| --- | --- | --- | --- |
| Inicio, claro | 1280 px | Tarjetas, acciones y módulos sin código expuesto, solapamientos o recortes visibles | https://www.genspark.ai/api/files/s/7DZKg0yr |
| Inicio, claro | 390 px | Resúmenes en dos columnas, módulos en una; sin desbordamiento horizontal ni contenido final tapado | https://www.genspark.ai/api/files/s/TSCmz6WV |
| Mi perfil, oscuro | 1280 px | Columnas equilibradas, identidad centrada, datos y preferencias legibles | https://www.genspark.ai/api/files/s/J9rWdHrr |
| Mi perfil, oscuro | 390 px | Rol largo legible, foto/inicial centrada, contenido apilado sin desbordamiento | https://www.genspark.ai/api/files/s/gI6kdF0I |

Dos intentos de captura móvil se encontraron con saturación del servicio y otro se interrumpió. La captura móvil final de Inicio sí terminó correctamente y es la enlazada arriba.

## Límites y revisiones todavía pendientes

- No se ha comprobado visualmente cada pantalla/estado a 360, 768, 1024 y 1440 px; las herramientas disponibles exponen 390 y 1280 px.
- No se ha ejecutado un validador formal HTML/CSS ni una auditoría completa WCAG AA. Foco, semántica, etiquetas y reducción de movimiento están implementados, pero contraste y todos los tamaños táctiles requieren auditoría adicional.
- La prueba de rutas verifica renderizado e interacción, no privacidad.
- El dictado con micrófono real depende del navegador y sus permisos; no se ha probado audio real en headless.
- Falta revisión en dispositivos físicos y con teclado virtual, Safari y Firefox.
- Falta prueba end-to-end de diálogos nativos de descarga/importación, impresión física y persistencia bajo cuota agotada. La generación de archivos y la lógica de importación sí están implementadas; la importación y consistencia del estado se prueban automáticamente.
- No hay pruebas de backend, transacciones distribuidas, autorización multiusuario ni alojamiento de producción porque esas funciones no existen en esta versión.
- No se ha ejecutado Hosted Deploy. Las capturas corresponden al renderizado de los archivos del proyecto, no a una URL de producción.

## Repetir las comprobaciones

1. Abrir `tests.html` y esperar el resumen. El namespace temporal se limpia al finalizar.
2. Abrir `index.html#inicio` para la revisión visual del uso normal.
3. Abrir `review.html` para revisar el perfil oscuro con datos iniciales aislados. Cambiar `route`/`theme` en `review-config.js` si se necesita otro caso. Este lanzador deja únicamente sus datos `dali-os-qa-review-*`; se pueden borrar desde las herramientas del navegador sin tocar `dali-os-local-v1`.
4. No confundir datos QA con datos de uso personal ni abrir la URL `?qa=...` como entrada habitual.
