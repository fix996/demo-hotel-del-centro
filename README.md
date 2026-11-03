# Hotel del Centro — demo conceptual

Web independiente y ficticia para mostrar a negocios de alojamiento una página sencilla. Incluye tres habitaciones con fotos ilustrativas y un pedido de habitación simulado. El visitante escribe entre qué fechas le gustaría viajar, elige huéspedes y ve un resumen. No se consulta disponibilidad ni precio, no se envían ni se guardan datos y no se confirma ninguna reserva.

## Abrir

Abrí `dist/index.html` en un navegador. Para una vista con servidor local, desde `dist` ejecutá `python -m http.server 8767` y visitá `http://localhost:8767/`.

## Archivos

- `dist/index.html`: estructura y textos.
- `dist/styles.css`: diseño adaptable.
- `dist/rooms.js`: catálogo ficticio de habitaciones.
- `dist/app.js`: detalles y pedido simulado.
- `dist/assets/`: fotos generadas para la demo.
- `scripts/check.mjs`: comprobaciones locales.

Comprobar con `node scripts/check.mjs`. No requiere instalación, fuentes externas ni variables de entorno. Para un hotel real hacen falta fotos y servicios verificados, contacto autorizado y un sistema que reciba consultas o gestione disponibilidad.
