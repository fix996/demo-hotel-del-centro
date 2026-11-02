# Altura Hotel — demo conceptual

Sitio independiente de ejemplo para mostrar cómo podría verse y funcionar la web de un hotel boutique. La marca, las fotos, las habitaciones, los servicios y las tarifas son ilustrativos. El buscador filtra por capacidad; no consulta disponibilidad. La reserva calcula un total de ejemplo en el navegador y no envía ni guarda datos, no cobra y no confirma una estadía.

## Abrir

Abrí `dist/index.html` en un navegador. Para previsualizar con servidor local: desde `dist`, ejecutá `python -m http.server 8767` y visitá `http://localhost:8767/`.

## Estructura

- `dist/index.html`: estructura y textos de la web.
- `dist/styles.css`: diseño adaptable.
- `dist/rooms.js`: único catálogo de habitaciones, capacidad y tarifas ilustrativas.
- `dist/app.js`: búsqueda, detalles y reserva simulada.
- `dist/assets/`: fotografías ilustrativas.
- `scripts/check.mjs`: controles locales de estructura y contenido.

## Comprobar

`node scripts/check.mjs`

No hay instalación, paquetes JavaScript ni variables de entorno. Las tipografías se cargan desde Google Fonts cuando hay conexión; sin conexión se usan fuentes del sistema. Para usarla con un hotel real se necesitan contenidos y precios aprobados y un sistema de disponibilidad y reservas con servidor.
