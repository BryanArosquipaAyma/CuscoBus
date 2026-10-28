let mapModal = null;
let currentPolyline = null;
let todasLasRutas = [];
let rutaActualModal = null;
let simulacionInterval = null;
let busMarker = null;
let paraderoActualId = null;
let todosLosPaises = [];

// 1. TOAST
function mostrarToast(mensaje, icono = '✅') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${icono}</span> <span>${mensaje}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
}

// 2. MODO OSCURO
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    document.querySelector('.btn-darkmode').innerText = isDark ? '☀️' : '🌙';
}

// 3. NAVEGACIÓN
function showSection(sectionId, element) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(`section-${sectionId}`).classList.add('active');
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    if(element) element.classList.add('active');
    if (sectionId === 'favoritos') renderizarFavoritos();
}

// 4. SELECTOR DE PAÍSES (NUEVO)
async function abrirPaises() {
    document.getElementById('modal-paises').classList.add('active');
    if (todosLosPaises.length === 0) {
        const res = await fetch('/api/paises');
        todosLosPaises = await res.json();
        renderizarPaises(todosLosPaises);
    }
}

function cerrarPaises() {
    document.getElementById('modal-paises').classList.remove('active');
}

function renderizarPaises(paises) {
    const container = document.getElementById('lista-paises');
    container.innerHTML = '';
    paises.forEach(p => {
        const div = document.createElement('div');
        div.className = 'pais-item';
        div.onclick = () => seleccionarPais(p);
        div.innerHTML = `<span class="flag">${p.bandera}</span> <span class="name">${p.nombre}</span>`;
        container.appendChild(div);
    });
}

function filtrarPaises() {
    const query = document.getElementById('buscador-paises').value.toLowerCase();
    const filtrados = todosLosPaises.filter(p => p.nombre.toLowerCase().includes(query));
    renderizarPaises(filtrados);
}

function seleccionarPais(pais) {
    document.getElementById('current-flag').innerText = pais.bandera;
    document.getElementById('current-country').innerText = pais.ciudad;
    cerrarPaises();
    mostrarToast(`Ubicación cambiada a ${pais.ciudad}, ${pais.nombre}`, '🌎');
    
    // Nota: Como la app está centrada en Cusco, los datos (rutas, clima) siguen siendo de Cusco.
    // En una app real, aquí se recargarían los datos según el país.
}

// 5. CLIMA
async function cargarClima() {
    try {
        const res = await fetch('/api/weather');
        const data = await res.json();
        document.getElementById('w-temp').innerText = data.temp;
        document.getElementById('w-desc').innerText = data.description;
        const desc = data.description.toLowerCase();
        const iconEl = document.getElementById('w-icon');
        if (desc.includes('lluvia') || desc.includes('rain')) iconEl.innerText = '🌧️';
        else if (desc.includes('nube') || desc.includes('cloud')) iconEl.innerText = '☁️';
        else if (desc.includes('sol') || desc.includes('clear')) iconEl.innerText = '☀️';
        else iconEl.innerText = '🌤️';
    } catch (e) {}

    try {
        const resTom = await fetch('/api/weather/tomorrow');
        const dataTom = await resTom.json();
        document.getElementById('w-tom-max').innerText = dataTom.tempMax;
        document.getElementById('w-tom-min').innerText = dataTom.tempMin;
        document.getElementById('w-tom-rain').innerText = dataTom.lluviaProb;
    } catch (e) {}
}

// 6. SKELETONS
function mostrarSkeletons() {
    const container = document.getElementById('rutas-container');
    container.innerHTML = '';
    for(let i=0; i<6; i++) {
        const sk = document.createElement('div');
        sk.className = 'skeleton-card';
        sk.innerHTML = `<div class="skeleton-img"></div><div class="skeleton-text" style="margin-top:25px;"></div><div class="skeleton-text short"></div>`;
        container.appendChild(sk);
    }
}

// 7. INICIALIZACIÓN
async function loadApp() {
    if(localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        document.querySelector('.btn-darkmode').innerText = '☀️';
    }
    cargarClima();
    mostrarSkeletons();
    try {
        const rRes = await fetch('/api/rutas');
        todasLasRutas = await rRes.json();
        renderizarRutas(todasLasRutas);
    } catch(e) { document.getElementById('rutas-container').innerHTML = '<p>Error al cargar las rutas.</p>'; }
}

// 8. RUTAS
function renderizarRutas(rutas) {
    const container = document.getElementById('rutas-container');
    container.innerHTML = '';
    if (rutas.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">No se encontraron rutas.</p>';
        return;
    }
    const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    rutas.forEach(ruta => {
        const isFav = favoritos.includes(ruta.id);
        const card = document.createElement('div');
        card.className = 'ruta-card';
        card.innerHTML = `
            <div class="ruta-header">
                <img src="${ruta.foto}" class="ruta-img" alt="${ruta.nombre}">
                <span class="ruta-badge" style="background:${ruta.color}">${ruta.id.toUpperCase()}</span>
                <button class="btn-fav" onclick="toggleFavorito('${ruta.id}', event)">${isFav ? '❤️' : '🤍'}</button>
            </div>
            <div class="ruta-body">
                <h3 class="ruta-title">${ruta.nombre}</h3>
                <p class="ruta-desc">${ruta.descripcion}</p>
                <div class="ruta-stats">
                    <span class="stat">⏱️ ${ruta.duracion}</span>
                    <span class="stat">🚏 ${ruta.paradasTotales} paradas</span>
                </div>
                <button class="btn-ver-recorrido" onclick="verRecorrido('${ruta.id}')">Ver recorrido completo ↗</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function filtrarRutas() {
    const query = document.getElementById('buscador-rutas').value.toLowerCase();
    const filtradas = todasLasRutas.filter(r => r.nombre.toLowerCase().includes(query) || r.descripcion.toLowerCase().includes(query));
    renderizarRutas(filtradas);
}

function toggleFavorito(rutaId, event) {
    event.stopPropagation();
    let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    if (favoritos.includes(rutaId)) {
        favoritos = favoritos.filter(id => id !== rutaId);
        event.target.innerText = '🤍';
        mostrarToast('Ruta eliminada de favoritos', '💔');
    } else {
        favoritos.push(rutaId);
        event.target.innerText = '❤️';
        mostrarToast('Ruta guardada en favoritos', '❤️');
    }
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
}

function renderizarFavoritos() {
    const container = document.getElementById('favoritos-container');
    const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    const rutasFav = todasLasRutas.filter(r => favoritos.includes(r.id));
    if (rutasFav.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">Aún no tienes rutas favoritas.</p>';
        return;
    }
    container.innerHTML = '';
    rutasFav.forEach(ruta => {
        const card = document.createElement('div');
        card.className = 'ruta-card';
        card.innerHTML = `
            <div class="ruta-header">
                <img src="${ruta.foto}" class="ruta-img">
                <span class="ruta-badge" style="background:${ruta.color}">${ruta.id.toUpperCase()}</span>
                <button class="btn-fav" onclick="toggleFavorito('${ruta.id}', event)">❤️</button>
            </div>
            <div class="ruta-body">
                <h3 class="ruta-title">${ruta.nombre}</h3>
                <p class="ruta-desc">${ruta.descripcion}</p>
                <button class="btn-ver-recorrido" onclick="verRecorrido('${ruta.id}')">Ver recorrido completo ↗</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// 9. MODAL RECORRIDO
function verRecorrido(rutaId) {
    rutaActualModal = todasLasRutas.find(r => r.id === rutaId);
    if (!rutaActualModal) return;
    document.getElementById('modal-title').innerText = rutaActualModal.nombre;
    const listaContainer = document.getElementById('lista-paradas');
    listaContainer.innerHTML = '';
    rutaActualModal.paraderos.forEach((p, index) => {
        const div = document.createElement('div');
        div.className = 'paradero-item';
        div.onclick = () => abrirTiempos(p.id, p.nombre);
        div.innerHTML = `
            <div class="paradero-punto" style="background:${rutaActualModal.color}"></div>
            <div class="paradero-linea"></div>
            <div class="paradero-info">
                <h4>${p.nombre}</h4>
                <p>Parada ${index + 1}</p>
                <span class="ver-tiempo">Ver tiempos de llegada →</span>
            </div>
        `;
        listaContainer.appendChild(div);
    });
    document.getElementById('modal-recorrido').style.display = 'flex';
    if (!mapModal) {
        mapModal = L.map('map-modal').setView([-13.53, -71.96], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(mapModal);
    }
    mapModal.eachLayer((layer) => {
        if (layer instanceof L.Polyline || layer instanceof L.Marker || layer instanceof L.CircleMarker) mapModal.removeLayer(layer);
    });
    const coords = rutaActualModal.paraderos.map(p => [p.lat, p.lng]);
    rutaActualModal.paraderos.forEach(p => {
        L.circleMarker([p.lat, p.lng], { radius: 6, fillColor: rutaActualModal.color, color: "#fff", weight: 2, fillOpacity: 1 }).addTo(mapModal).bindPopup(p.nombre);
    });
    currentPolyline = L.polyline(coords, { color: rutaActualModal.color, weight: 5 }).addTo(mapModal);
    setTimeout(() => { mapModal.invalidateSize(); mapModal.fitBounds(currentPolyline.getBounds(), { padding: [30, 30] }); }, 300);
    detenerSimulacion();
}

function cerrarModalRecorrido() {
    document.getElementById('modal-recorrido').style.display = 'none';
    detenerSimulacion();
}

// 10. MODAL TIEMPOS
async function abrirTiempos(paraderoId, nombre) {
    paraderoActualId = paraderoId;
    document.getElementById('tiempos-titulo').innerText = `📍 ${nombre}`;
    document.getElementById('modal-tiempos').classList.add('active');
    const lista = document.getElementById('tiempos-lista');
    lista.innerHTML = '<li style="text-align:center; padding: 20px;">Calculando tiempos...</li>';
    try {
        const res = await fetch(`/api/paradero/${paraderoId}/tiempos`);
        const tiempos = await res.json();
        lista.innerHTML = '';
        if (tiempos.length === 0) {
            lista.innerHTML = '<li style="text-align:center;">No hay rutas registradas en este paradero.</li>';
        } else {
            tiempos.forEach(t => {
                lista.innerHTML += `<li><div style="display:flex; align-items:center; gap:10px;"><span style="width:12px; height:12px; border-radius:50%; background:${t.color}; display:inline-block;"></span><span style="font-weight:600; font-size:15px;">${t.nombreRuta}</span></div><span class="badge-tiempo">${t.minutos} min</span></li>`;
            });
        }
    } catch(e) { lista.innerHTML = '<li style="text-align:center;">Error al cargar tiempos.</li>'; }
}

function cerrarTiempos() { document.getElementById('modal-tiempos').classList.remove('active'); }

// 11. SIMULACIÓN
function toggleSimulacion() {
    const btn = document.getElementById('btn-simular');
    const panel = document.getElementById('simulador-panel');
    if (simulacionInterval) {
        detenerSimulacion();
    } else {
        btn.innerText = '🛑 Detener Simulación';
        btn.classList.add('active');
        panel.classList.add('active');
        mostrarToast('Simulación iniciada', '🚌');
        const coords = rutaActualModal.paraderos.map(p => [p.lat, p.lng]);
        const busIcon = L.divIcon({ html: '🚌', className: 'bus-icon', iconSize: [30, 30] });
        if (busMarker) mapModal.removeLayer(busMarker);
        busMarker = L.marker(coords[0], { icon: busIcon }).addTo(mapModal);
        let paso = 0;
        simulacionInterval = setInterval(() => {
            if (paso < coords.length) {
                busMarker.setLatLng(coords[paso]);
                document.getElementById('simulador-texto').innerText = `Llegando a: ${rutaActualModal.paraderos[paso].nombre}`;
                paso++;
            } else {
                document.getElementById('simulador-texto').innerText = '¡Has llegado a tu destino!';
                setTimeout(detenerSimulacion, 2000);
            }
        }, 1500);
    }
}

function detenerSimulacion() {
    const btn = document.getElementById('btn-simular');
    const panel = document.getElementById('simulador-panel');
    if (simulacionInterval) clearInterval(simulacionInterval);
    simulacionInterval = null;
    btn.innerText = '▶ Simular recorrido';
    btn.classList.remove('active');
    panel.classList.remove('active');
    if (busMarker) { mapModal.removeLayer(busMarker); busMarker = null; }
}

// 12. PDF
function exportarPDF() {
    if (!rutaActualModal) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(22); doc.text("CuscoBus - Itinerario", 20, 20);
    doc.setFontSize(14); doc.text(rutaActualModal.nombre, 20, 30);
    let y = 45;
    rutaActualModal.paraderos.forEach((p, index) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(`${index + 1}. ${p.nombre}`, 25, y); y += 7;
    });
    doc.save(`Ruta_${rutaActualModal.id}.pdf`);
    mostrarToast('PDF descargado exitosamente', '📄');
}

// EXPONER FUNCIONES
window.showSection = showSection;
window.verRecorrido = verRecorrido;
window.cerrarModalRecorrido = cerrarModalRecorrido;
window.toggleFavorito = toggleFavorito;
window.filtrarRutas = filtrarRutas;
window.toggleSimulacion = toggleSimulacion;
window.toggleDarkMode = toggleDarkMode;
window.exportarPDF = exportarPDF;
window.abrirTiempos = abrirTiempos;
window.cerrarTiempos = cerrarTiempos;
window.abrirPaises = abrirPaises;
window.cerrarPaises = cerrarPaises;
window.filtrarPaises = filtrarPaises;

document.addEventListener('DOMContentLoaded', loadApp);
