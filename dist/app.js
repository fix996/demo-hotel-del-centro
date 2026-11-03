const roomById = new Map(rooms.map(room => [room.id, room]));
const roomGrid = document.querySelector("#room-grid");
const roomDialog = document.querySelector("#room-dialog");
const dialogContent = document.querySelector("#dialog-content");
const closeDialog = document.querySelector("#close-dialog");
let lastOpener = null;

roomGrid.innerHTML = rooms.map(room => `
  <article class="room-card">
    <img src="${room.image}" alt="${room.alt}" width="1536" height="1024" loading="lazy">
    <div class="room-card-body">
      <p class="room-capacity">HASTA ${room.capacity} PERSONAS</p>
      <h3>${room.name}</h3>
      <p>${room.description}</p>
      <div class="room-card-bottom"><span>${room.beds}</span><button type="button" data-room="${room.id}" aria-label="Ver y consultar ${room.name}">Ver y consultar <span aria-hidden="true">→</span></button></div>
    </div>
  </article>`).join("");

function openRoom(room, opener) {
  lastOpener = opener;
  dialogContent.innerHTML = `
    <div class="detail-image"><img src="${room.image}" alt="${room.alt}" width="1536" height="1024"></div>
    <div class="detail-body">
      <p class="eyebrow">HABITACIÓN DE EJEMPLO</p>
      <h2 id="dialog-title">${room.name}</h2>
      <p class="detail-description">${room.description}</p>
      <div class="detail-facts"><span>Hasta ${room.capacity} personas</span><span>${room.beds}</span></div>
      <h3>Detalles de la habitación</h3>
      <ul>${room.features.map(feature => `<li>${feature}</li>`).join("")}</ul>
      <form id="request-form" class="request-form">
        <h3>Consultá esta habitación</h3>
        <p>Escribí cuándo te gustaría venir, aunque sea una fecha aproximada.</p>
        <label for="travel-date">¿Para cuándo la necesitás?</label>
        <input id="travel-date" name="travel-date" type="text" placeholder="Ej.: del 12 al 15 de noviembre" minlength="4" maxlength="80" required autocomplete="off">
        <div class="request-fields">
          <div><label for="guest-count">¿Cuántas personas?</label><select id="guest-count" name="guests">${Array.from({ length: room.capacity }, (_, index) => `<option value="${index + 1}">${index + 1} ${index === 0 ? "persona" : "personas"}</option>`).join("")}</select></div>
          <div><label for="night-count">¿Cuántas noches?</label><select id="night-count" name="nights"><option value="1">1 noche</option><option value="2">2 noches</option><option value="3">3 noches</option><option value="4 o más">4 o más noches</option></select></div>
        </div>
        <p class="request-note">Demo: no se consulta disponibilidad ni precio. No se envía información ni se confirma una reserva.</p>
        <button type="submit" class="button button-dark">Simular pedido <span aria-hidden="true">→</span></button>
      </form>
      <div class="request-result" id="request-result" role="status" tabindex="-1" hidden></div>
    </div>`;
  roomDialog.showModal();
  closeDialog.focus();
}

roomGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-room]");
  if (!button) return;
  const room = roomById.get(button.dataset.room);
  if (room) openRoom(room, button);
});

dialogContent.addEventListener("input", event => {
  if (!event.target.closest("#request-form")) return;
  dialogContent.querySelector("#request-result").hidden = true;
  if (event.target.id === "travel-date") event.target.setCustomValidity("");
});
dialogContent.addEventListener("change", event => {
  if (event.target.closest("#request-form")) dialogContent.querySelector("#request-result").hidden = true;
});
dialogContent.addEventListener("submit", event => {
  if (event.target.id !== "request-form") return;
  event.preventDefault();
  const form = event.target;
  const dateText = form.querySelector("#travel-date").value.trim();
  if (dateText.length < 4) {
    form.querySelector("#travel-date").setCustomValidity("Escribí una fecha aproximada.");
    form.reportValidity();
    return;
  }
  form.querySelector("#travel-date").setCustomValidity("");
  const room = roomById.get(lastOpener.dataset.room);
  const guests = Number(form.querySelector("#guest-count").value);
  const nights = form.querySelector("#night-count").value;
  const result = dialogContent.querySelector("#request-result");
  result.replaceChildren();
  const heading = document.createElement("strong");
  heading.textContent = "Pedido de ejemplo preparado";
  const summary = document.createElement("p");
  summary.textContent = `${room.name} · ${guests} ${guests === 1 ? "persona" : "personas"} · ${nights} ${nights === "1" ? "noche" : "noches"} · ${dateText}.`;
  const note = document.createElement("small");
  note.textContent = "Este pedido no se envió al hotel. La disponibilidad y el precio quedan sujetos a confirmación.";
  result.append(heading, summary, note);
  result.hidden = false;
  result.focus();
});
closeDialog.addEventListener("click", () => roomDialog.close());
roomDialog.addEventListener("click", event => { if (event.target === roomDialog) roomDialog.close(); });
roomDialog.addEventListener("close", () => lastOpener?.focus());
