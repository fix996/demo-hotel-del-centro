const roomById = new Map(rooms.map(room => [room.id, room]));
const roomGrid = document.querySelector("#room-grid");
const roomCount = document.querySelector("#room-count");
const searchForm = document.querySelector("#search-form");
const searchArrival = document.querySelector("#search-arrival");
const searchDeparture = document.querySelector("#search-departure");
const searchGuests = document.querySelector("#search-guests");
const searchError = document.querySelector("#search-error");
const showAll = document.querySelector("#show-all");
const roomDialog = document.querySelector("#room-dialog");
const dialogContent = document.querySelector("#dialog-content");
let guestFilter = 0;
let roomOpener = null;

const today = new Date();
const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
searchArrival.min = todayISO;
searchDeparture.min = todayISO;

function dateNumber(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return Date.UTC(year, month - 1, day) / 86400000;
}

function formatDate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)));
}

function money(amount) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(amount);
}

function validateDates(arrival, departure) {
  if (!arrival || !departure) return "Elegí una fecha de entrada y una de salida.";
  if (dateNumber(arrival) < dateNumber(todayISO)) return "La entrada no puede ser anterior a hoy.";
  if (dateNumber(departure) <= dateNumber(arrival)) return "La salida debe ser posterior a la entrada.";
  return "";
}

function renderRooms() {
  const visible = rooms.filter(room => room.capacity >= guestFilter);
  roomCount.textContent = `${visible.length} ${visible.length === 1 ? "habitación" : "habitaciones"} de ejemplo${guestFilter ? ` para ${guestFilter} ${guestFilter === 1 ? "huésped" : "huéspedes"}` : ""}`;
  showAll.hidden = guestFilter === 0;
  roomGrid.innerHTML = visible.map(room => `
    <article class="room-card">
      <div class="room-photo"><img src="${room.image}" alt="${room.alt}" width="1536" height="1024" loading="lazy"><span>${room.label}</span></div>
      <div class="room-body"><div class="room-heading"><div><p class="eyebrow">HASTA ${room.capacity} ${room.capacity === 1 ? "HUÉSPED" : "HUÉSPEDES"}</p><h3>${room.name}</h3></div><span class="room-index">0${rooms.indexOf(room) + 1} / 03</span></div>
        <p>${room.description}</p><div class="room-specs"><span>${room.beds}</span><span>Tarifa ilustrativa</span></div>
        <div class="room-bottom"><div><small>Desde / noche de ejemplo</small><strong>${money(room.rate)}</strong></div><button type="button" data-room="${room.id}" aria-label="Ver ${room.name}">Ver habitación <span aria-hidden="true">↗</span></button></div>
      </div>
    </article>`).join("");
}

function openRoom(id, opener) {
  const room = roomById.get(id);
  if (!room) return;
  roomOpener = opener;
  dialogContent.innerHTML = `
    <div class="detail-photo"><img src="${room.image}" alt="${room.alt}" width="1536" height="1024"></div>
    <div class="detail-body"><p class="eyebrow">${room.label} / DEMO</p><h2 id="dialog-title">${room.name}</h2><p class="detail-description">${room.description}</p>
      <div class="detail-specs"><span>${room.beds}</span><span>Hasta ${room.capacity} huéspedes</span></div>
      <h3>En esta habitación de ejemplo</h3><ul>${room.features.map(feature => `<li>${feature}</li>`).join("")}</ul>
      <form id="booking-form" class="booking-form"><div class="booking-fields"><label for="booking-arrival">Entrada<input id="booking-arrival" type="date" required></label><label for="booking-departure">Salida<input id="booking-departure" type="date" required></label></div>
        <label for="booking-guests">Huéspedes<select id="booking-guests">${Array.from({ length: room.capacity }, (_, index) => `<option value="${index + 1}">${index + 1} ${index ? "huéspedes" : "huésped"}</option>`).join("")}</select></label>
        <div class="rate-line"><span>Tarifa ilustrativa por noche</span><strong>${money(room.rate)}</strong></div><p class="booking-note">La disponibilidad no se consulta. Esta reserva no se envía, no se guarda y no cobra.</p>
        <p id="booking-error" class="booking-error" role="alert" hidden></p><button type="submit" class="button button-dark">Simular reserva <span aria-hidden="true">↗</span></button></form>
      <div id="booking-result" class="booking-result" role="status" tabindex="-1" hidden></div>
    </div>`;

  const arrival = dialogContent.querySelector("#booking-arrival");
  const departure = dialogContent.querySelector("#booking-departure");
  arrival.min = todayISO;
  departure.min = todayISO;
  arrival.value = searchArrival.value;
  departure.value = searchDeparture.value;
  dialogContent.querySelector("#booking-guests").value = String(Math.min(Number(searchGuests.value), room.capacity));
  if (arrival.value) departure.min = arrival.value;
  roomDialog.showModal();
  document.querySelector("#close-dialog").focus();
}

renderRooms();

searchArrival.addEventListener("change", () => {
  searchDeparture.min = searchArrival.value || todayISO;
  if (searchDeparture.value && searchDeparture.value <= searchArrival.value) searchDeparture.value = "";
  searchError.hidden = true;
});
searchDeparture.addEventListener("change", () => { searchError.hidden = true; });
searchForm.addEventListener("submit", event => {
  event.preventDefault();
  const error = validateDates(searchArrival.value, searchDeparture.value);
  if (error) { searchError.textContent = error; searchError.hidden = false; searchDeparture.focus(); return; }
  searchError.hidden = true;
  guestFilter = Number(searchGuests.value);
  renderRooms();
  document.querySelector("#habitaciones").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
});
showAll.addEventListener("click", () => { guestFilter = 0; renderRooms(); });
roomGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-room]");
  if (button) openRoom(button.dataset.room, button);
});

dialogContent.addEventListener("change", event => {
  if (event.target.id !== "booking-arrival") return;
  const departure = dialogContent.querySelector("#booking-departure");
  departure.min = event.target.value || todayISO;
  if (departure.value && departure.value <= event.target.value) departure.value = "";
});
dialogContent.addEventListener("submit", event => {
  event.preventDefault();
  const form = event.target;
  if (form.id !== "booking-form" || !form.reportValidity()) return;
  const room = roomById.get(roomOpener.dataset.room);
  const arrival = form.querySelector("#booking-arrival").value;
  const departure = form.querySelector("#booking-departure").value;
  const guests = Number(form.querySelector("#booking-guests").value);
  const error = validateDates(arrival, departure);
  const errorElement = dialogContent.querySelector("#booking-error");
  if (error || guests > room.capacity) {
    errorElement.textContent = error || "La cantidad de huéspedes supera la capacidad de la habitación.";
    errorElement.hidden = false;
    return;
  }
  errorElement.hidden = true;
  const nights = dateNumber(departure) - dateNumber(arrival);
  const result = dialogContent.querySelector("#booking-result");
  result.innerHTML = `<strong>Reserva simulada</strong><p>${room.name} para ${guests} ${guests === 1 ? "huésped" : "huéspedes"}, del ${formatDate(arrival)} al ${formatDate(departure)} (${nights} ${nights === 1 ? "noche" : "noches"}).</p><p>Total ilustrativo: <strong>${money(nights * room.rate)}</strong>.</p><small>No se verificó disponibilidad, no se envió información y no se realizó ningún pago.</small>`;
  result.hidden = false;
  result.focus();
});

document.querySelector("#close-dialog").addEventListener("click", () => roomDialog.close());
roomDialog.addEventListener("click", event => { if (event.target === roomDialog) roomDialog.close(); });
roomDialog.addEventListener("close", () => roomOpener?.focus());
