import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const read = name => readFile(join(root, name), 'utf8');
const [html, css, app, data] = await Promise.all(['index.html', 'styles.css', 'app.js', 'rooms.js'].map(read));
const context = vm.createContext({});
vm.runInContext(`${data}\nthis.catalog = rooms`, context);
const rooms = context.catalog;
const assert = (condition, message) => { if (!condition) throw new Error(message); };

assert(html.includes('DEMO CONCEPTUAL') && html.includes('no se confirma una reserva real'), 'Falta aviso visible de simulación');
assert(html.includes('id="room-dialog"') && html.includes('id="room-grid"'), 'Falta recorrido principal');
assert(!html.includes('type="date"') && !app.includes('type="date"'), 'El calendario anterior sigue presente');
assert(css.includes('max-width: 370px') && css.includes('prefers-reduced-motion'), 'Faltan estilos de accesibilidad y pantalla pequeña');
assert(app.includes('Simular pedido') && app.includes('Pedido de ejemplo preparado'), 'Falta el pedido simulado');
assert(rooms.length >= 3, 'Se esperan al menos tres habitaciones');
assert(new Set(rooms.map(room => room.id)).size === rooms.length, 'IDs duplicados');
for (const room of rooms) {
  assert(room.capacity > 0 && room.features.length > 0, `Datos inválidos en ${room.id}`);
  assert((await stat(join(root, room.image))).size > 0, `Falta imagen de ${room.id}`);
  assert((await stat(join(root, room.thumbnail))).size > 0, `Falta miniatura de ${room.id}`);
}
for (const image of ['assets/fachada.jpg', 'favicon.svg']) assert((await stat(join(root, image))).size > 0, `Falta ${image}`);
console.log('OK: estructura, avisos de demo, catálogo e imágenes');
