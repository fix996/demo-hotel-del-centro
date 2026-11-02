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

assert(html.includes('DEMO CONCEPTUAL') && html.includes('no se realiza ninguna reserva real'), 'Falta aviso visible de simulación');
assert(html.includes('id="room-dialog"') && html.includes('id="search-form"'), 'Falta recorrido principal');
assert(css.includes('@media(max-width:380px)') && css.includes('prefers-reduced-motion'), 'Faltan estilos de accesibilidad y pantalla pequeña');
assert(app.includes('validateDates') && app.includes('Reserva simulada'), 'Falta validación o resultado de simulación');
assert(rooms.length >= 3, 'Se esperan al menos tres habitaciones');
assert(new Set(rooms.map(room => room.id)).size === rooms.length, 'IDs duplicados');
for (const room of rooms) {
  assert(room.capacity > 0 && room.rate > 0, `Datos inválidos en ${room.id}`);
  assert((await stat(join(root, room.image))).size > 0, `Falta imagen de ${room.id}`);
}
for (const image of ['assets/exterior.jpg', 'assets/desayuno.jpg', 'favicon.svg']) assert((await stat(join(root, image))).size > 0, `Falta ${image}`);
console.log('OK: estructura, avisos de demo, catálogo e imágenes');
