# DALI OS — Centro de mando personal

Versión **0.1, local funcional**. HTML, CSS y JavaScript Vanilla; Tailwind Browser 4.1.13 y Lucide 0.468.0 por jsDelivr, fuentes DM Sans y Manrope por Google Fonts. Sin Node, paquetes instalados, build ni servidor de aplicación.

> **No es todavía la aplicación full-stack privada solicitada.** No incluye login, cuentas, RLS, sincronización remota ni validación de servidor. Los datos de esta versión viven en este navegador y origen, sin cifrado. No utilizar en equipos compartidos ni publicar suponiendo que existe protección de acceso.

## Auditoría inicial y decisiones

El repositorio estaba vacío. El único material recibido fue el documento `requirements.txt`, conservado íntegramente. No había aplicación financiera previa, capturas, base de datos ni registros reales que ejecutar, conservar o migrar.

Se implementó una alternativa local dentro de las capacidades de este entorno estático. No se crearon tablas públicas para información financiera o personal. La consulta a las reglas de acceso Hosted devolvió `membership_required` (Plus o superior): **no se guardaron reglas, no están activas y no se sustituyeron por una contraseña en JavaScript**.

## Abrir y usar

- Abrir `index.html` en la vista previa del proyecto o mediante un alojamiento estático HTTP/HTTPS.
- No requiere instalación ni compilación. La apertura directa con `file://` puede tener restricciones de UUID, IndexedDB y almacenamiento según el navegador; se recomienda HTTP local o HTTPS.
- Se necesita conexión para cargar las fuentes y librerías CDN inicialmente. No se ha implementado un service worker ni una garantía de recarga sin conexión.
- Cambiar el nombre, moneda de presentación y opciones iniciales en `config.js`. La lógica de esta versión está diseñada para MXN y periodos de `America/Mexico_City`; cambiar esos valores no migra importes ni calendarios.
- El nombre del producto está centralizado en `DALI_CONFIG.name`. Los nombres de los archivos de respaldo conservan el prefijo portable `dali`.

## Funciones implementadas

### Navegación e Inicio
- Ocho módulos navegables, sección anterior recordada, buscador global (Ctrl/Cmd + K), tema claro/oscuro.
- Sidebar contraíble en escritorio y drawer en móvil, navegación inferior, diálogos adaptados a bottom sheet.
- Resúmenes derivados de los registros de los módulos; sin cifras financieras de muestra.
- Widgets ocultables y reordenables con preferencias persistentes.
- Acciones rápidas, pendientes de objetivos/pagos/seguimientos y feedback visible.

### Finanzas
- Tarjeta financiera visual, saldo derivado de movimientos y dinero almacenado en **centavos enteros**.
- Crear ingresos/gastos en dos pasos con pad numérico; editar y enviar a la papelera.
- Periodos semanal, mensual, anual y todo el historial.
- Buscar por concepto/nota, filtrar por tipo, categoría, fecha y monto; CSV de los registros filtrados e impresión del navegador.
- Categorías editables. Comparación de seis meses derivada de los movimientos en Inicio.
- Pagos pendientes y préstamos con abonos parciales, saldos calculados, historial y reversión.
- Abonos opcionalmente vinculados a ingresos/gastos; un mismo UUID de abono no genera dos movimientos. Los cambios se validan y guardan juntos en una única escritura local.
- No permite editar/borrar directamente un movimiento vinculado: debe revertirse desde el abono original. No permite borrar un cliente/pago/préstamo con abonos sin revertirlos primero.

### Objetivos
- Crear, editar, completar, archivar, eliminar y recuperar objetivos diarios/semanales/mensuales/anuales.
- Casillas o progreso numérico, categoría, prioridad, meta, unidad y fecha límite.
- Renovación al abrir la app y comprobación cada minuto mientras permanece abierta.
- Conserva el historial de periodos cerrados; los periodos sin visitas se registran con `recorded: false`, sin inventar cumplimiento. Renovación idempotente; máximo de seguridad de 10 000 periodos por operación.
- Conversión de seguimientos SOMA, actividades de aprendizaje y pendientes de bitácora mediante formulario de confirmación.

### SOMA
- Fichas y listado de clientes con búsqueda y filtro por etapa.
- Contacto, teléfono, email, responsable, proyecto, precio, entrega y siguiente seguimiento.
- Entregables con estado, notas y cobros parciales vinculables a Finanzas.
- Enlace `wa.me` con teléfono normalizado. No es WhatsApp Business API.
- Intensity es una ficha inicial editable con precio cero (sin importe real suministrado), no un contrato ficticio.

### Gimnasio
- Rutinas editables por día; plan inicial solicitado como punto de partida.
- Iniciar/retomar sesión, registrar peso, repeticiones, RIR y series completadas, agregar series y guardar cada cambio.
- Copiar la sesión anterior únicamente tras elección explícita.
- Finalizar sesiones, historial de sesiones y volumen calculado solo con series completadas.
- Descanso de 90 segundos con vencimiento persistente en el navegador; aviso dentro de la app, sin push remoto.
- Registro de peso corporal y notas, edición y recuperación.

### Aprendizaje
- Habilidades editables, tiempo disponible, estado y sesiones de estudio.
- Ruta manual en siete niveles, actividades editables/eliminables con puntos y evidencia textual.
- Progreso ponderado. Se limita a 99% hasta completar una prueba final con evidencia.
- Ruta inicial de 14 actividades para ventas SOMA, todas sin completar.
- Crear objetivos desde actividades con confirmación. No se simula generación con IA.

### Bitácora
- Relato manual, borrador local del texto, dictado opcional mediante SpeechRecognition y revisión antes de guardar.
- Reconocimiento sujeto a compatibilidad/permisos del navegador: puede enviar audio a su proveedor. DALI OS no conserva audio.
- Estructura manual: resumen, personal, escuela, trabajo, SOMA, gimnasio, logros, dificultades, aprendizaje, siguientes pasos, estado percibido, productividad autoevaluada y etiquetas.
- Historial con búsqueda, lectura completa, edición y recuperación. Validación del contrato antes de guardar.

### Perfil y datos
- Datos iniciales editables del documento, edad calculada y estadísticas derivadas.
- Foto local: subir JPG/PNG/WebP, acercar, reposicionar, recortar a 512 × 512, comprimir, cambiar, descargar y eliminar. Máximo 8 MB de entrada. Sin base64 ni subida remota.
- Perfil, tema, categorías, exportación JSON, importación aditiva por UUID y papelera.

## Entradas y URIs

| URI | Función |
| --- | --- |
| `index.html#inicio` | Centro de mando |
| `index.html#finanzas` | Movimientos, pagos y préstamos; pestañas/filtros en estado UI |
| `index.html#gimnasio` | Rutinas, historial, peso |
| `index.html#gimnasio/{uuid}` | Sesión de entrenamiento |
| `index.html#objetivos` | Objetivos por horizonte y archivo |
| `index.html#soma` | Clientes |
| `index.html#soma/{uuid}` | Ficha de cliente |
| `index.html#aprendizaje` | Habilidades |
| `index.html#aprendizaje/{uuid}` | Ruta y sesiones de estudio |
| `index.html#bitacora` | Historial personal |
| `index.html#bitacora/{uuid}` | Lectura completa de un día |
| `index.html#perfil` | Perfil, fotografía, preferencias y respaldos |
| `tests.html` | Pruebas funcionales en navegador con datos aislados |
| `review.html` | Lanzador de revisión: redirige al perfil real en tema oscuro con almacenamiento QA separado |
| `index.html?qa={identificador}#inicio` | Espacio local aislado para QA; no usar como ruta habitual |

Las rutas hash no son protección de acceso. No hay endpoints propios de API. **No existe una URL de producción desplegada por el agente.** El enlace de preview depende de la plataforma. No se ha ejecutado Hosted Deploy.

## Estructura de código y almacenamiento

- `config.js`: identidad, opciones iniciales, rutas y clave de almacenamiento.
- `domain.js`: dinero, saldos, abonos vinculados, periodos, edad, aprendizaje, validación de bitácora y escape HTML.
- `store.js`: validación del estado, persistencia, inicialización, CRUD local, importación, revisión de concurrencia entre pestañas.
- `views.js`: vistas derivadas del estado, sin cifras financieras duplicadas.
- `forms.js`: formularios y transformaciones de entrada.
- `photo.js`: procesamiento cliente e IndexedDB para el Blob de la foto.
- `app.js`: navegación, eventos y coordinación.
- `styles.css`: tokens y adaptación responsive.
- `tests.html` / `tests.js`: pruebas de lógica y flujos sobre la aplicación real dentro de un contexto QA aislado.
- `review.html`, `review-config.js`, `review.js`: lanzador de escenarios visuales que redirige a la aplicación real.
- `journal.schema.json`: contrato JSON del núcleo validado de la bitácora.
- `QA.md`: resultados ejecutados, capturas y comprobaciones pendientes.
- `.env.example`: documentación de una posible configuración futura; la app estática no consume variables de entorno.

### Modelo local v1

Estado JSON único bajo `localStorage['dali-os-local-v1']`: `version`, `revision`, `profile`, `preferences`, `categories` opcionales y colecciones `transactions`, `bills`, `loans`, `goals`, `clients`, `routines`, `sessions`, `metrics`, `skills`, `studySessions`, `journal`.

Registros: `id` UUID, `created_at`, `updated_at`; `deleted_at` para papelera. Fechas civiles `YYYY-MM-DD` según el calendario mexicano; timestamps técnicos ISO UTC. Abonos (`payments`), entregables, series, actividades e historial de objetivos son estructuras anidadas, **no un esquema Postgres normalizado ni tablas por usuario**. Un abono y su movimiento comparten un identificador de origen único. Los cambios de estado usan copia/validación y una escritura de localStorage. Esto no es una transacción distribuida ni una garantía de concurrencia multiusuario. Las pestañas desactualizadas deben recargarse para evitar sobrescrituras.

Claves auxiliares con el mismo prefijo: `-last-section`, `-rest-end`, `-journal-draft`.

Foto: IndexedDB `dali-os-local-v1-media`, object store `assets`, clave `profile`, valor Blob. Se muestra mediante URL `blob:` temporal. No usa R2, D1, CosmosDB ni Supabase.

## Respaldo e importación

1. Mi perfil → **Exportar respaldo JSON**. Incluye perfil, preferencias, registros y papelera, pero **no la foto**.
2. Mi fotografía → **Descargar foto** para respaldarla por separado.
3. Mi perfil → **Importar registros sin duplicados**: archivo JSON v1 de hasta 10 MB.
4. Antes de importar se genera un respaldo del estado actual. Se añaden solo UUID nuevos; **no se sobreescriben registros existentes ni se restaura automáticamente el perfil/preferencias del archivo**.
5. Si una combinación de respaldos genera incoherencia entre abonos y movimientos, se rechaza toda la operación sin alterar los datos. No mezclar respaldos divergentes esperando una sincronización bidireccional.
6. Conservar los respaldos fuera del navegador y de forma segura. Borrar datos del sitio, cambiar de dominio o usar navegación privada puede perder o separar el almacenamiento.

No hay migraciones SQL porque no existe backend implementado. La inicialización local v1 es reproducible en la función interna `initial()` de `store.js`, sin sobrescribir un estado previo. Una futura migración remota debe realizarse con respaldo, IDs conservados y autorización por propietario.

## Verificación

Abrir `tests.html` en el mismo alojamiento estático. Los casos usan un namespace `qa` único y limpian sus propios datos; no alteran registros de uso normal. El runner registra resultados en pantalla y consola. Ver `QA.md` para evidencia y límites de las comprobaciones visuales.

Última ejecución funcional: **39 correctas, 0 fallidas, 1 pendiente** (autenticación/protección de rutas no implementada). Incluye dinero, abonos, idempotencia, progreso ponderado, renovación, edad, JSON, formularios, cancelación sin guardado, XSS en títulos, todas las rutas, búsqueda, reversión, fotos, importación y persistencia tras recarga.

## Pendiente — no implementado ni simulado

**Producción y seguridad:** autenticación real, propietario `user_id`, multiusuario, Postgres/Supabase/RLS, validación de servidor, políticas de fotos privadas, URLs firmadas, backups remotos, sincronización, endpoints IA/transcripción y notificaciones push. No hay cierre de sesión porque no hay sesión autenticada. Un plan Plus habilitaría evaluar la protección Hosted de plataforma, pero por sí solo no implementa toda esta arquitectura.

**Funciones avanzadas del documento:** calendario de cuotas y adeudos adicionales separados en SOMA; notas con autores y auditoría normalizada; recurrencia automática de pagos personales; préstamos cancelados y calendarios estructurados; etapas editables desde UI; métricas/gráficas corporales, fotos de progreso, PR automáticos, calentamientos, RPE y reordenación de ejercicios; rachas históricas completas; dependencias de actividades y árbol de competencias; análisis automático de bitácora, calendario y tendencias semanales/mensuales; PWA y notificaciones del sistema. Las funciones básicas relacionadas se describen arriba, sin equipararlas a estas extensiones.

**QA:** revisión completa a 360, 768, 1024 y 1440 px; dispositivos reales, teclado virtual, Safari/Firefox, auditoría WCAG AA completa y validador formal HTML/CSS. Las herramientas actuales verifican visualmente 390 y 1280 px; no se afirma haber ejecutado los demás anchos.

## Próximos pasos recomendados

1. Revisar los flujos locales y exportar un respaldo con frecuencia.
2. Para datos sensibles en producción, elegir un entorno que permita implementar backend y autorización por usuario antes de migrar información real.
3. Implementar esquema normalizado, políticas y migraciones; probar aislamiento entre dos usuarios y transacciones financieras.
4. Completar las funciones avanzadas priorizadas, empezando por cuotas SOMA y recurrencias de pagos.
5. Ampliar QA responsive, accesibilidad, navegadores y tratamiento de errores/cuotas de almacenamiento.
6. Publicar solo conociendo estos límites. Para publicación estática manual se utiliza la pestaña **Publish**. No se ha solicitado ni ejecutado un despliegue Hosted en esta entrega.
