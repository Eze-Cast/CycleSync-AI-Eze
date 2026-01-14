// Variable global para el mapa
var map = null;

document.addEventListener('DOMContentLoaded', () => {

    // 1. CONTROL DE MENÚ ACTIVO
    const currentLocation = location.href;
    const menuItem = document.querySelectorAll('.nav-links a');
    menuItem.forEach(item => {
        if(item.href === currentLocation) item.classList.add('active');
    });

    // 2. INICIALIZACIÓN DEL MAPA
    const mapElement = document.getElementById('map');
    if (mapElement) {
        // Centrar en Bajío
        map = L.map('map').setView([21.1221, -101.6826], 13);

        // Capa OpenStreetMap (Filtro CSS la hace oscura)
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);

        // Icono seguro
        var cyanIcon = L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        // Marcadores
        L.marker([21.125, -101.68], {icon: cyanIcon}).addTo(map)
            .bindPopup("<b>Planta Volkswagen</b><br>Estado: Operativo");
        L.marker([21.116, -101.65], {icon: cyanIcon}).addTo(map)
            .bindPopup("<b>Recicladora del Bajío</b><br>Estado: En ruta");
        L.marker([21.150, -101.70], {icon: cyanIcon}).addTo(map)
            .bindPopup("<b>Eco-Electrónica</b><br>Estado: Disponible");
            
        setTimeout(() => { map.invalidateSize(); }, 500);
    }
});

// 3. FUNCIÓN DE SIMULACIÓN Y BITÁCORA
window.runSimulation = function() {
    const laser = document.getElementById('laser');
    const placeholder = document.getElementById('camera-placeholder');
    const imgElement = document.getElementById('scanned-img');
    const title = document.getElementById('res-title');
    const conf = document.getElementById('res-conf');
    const tableBody = document.getElementById('log-body');

    if(!laser) return; // Si no hay láser, no estamos en la demo

    // --- AQUÍ ESTÁN TUS IMÁGENES LOCALES ---
    // Asegúrate de que los nombres de archivo coincidan en tu carpeta assets/images/
    const items = [
        { 
            name: "Aluminio (Scrap)", 
            conf: "98.5%", 
            img: "assets/images/lata.jpg"  // <--- IMAGEN LOCAL
        },
        { 
            name: "Plástico PET", 
            conf: "96.2%", 
            img: "assets/images/pet.jpg"   // <--- IMAGEN LOCAL
        },
        { 
            name: "Cartón Corrugado", 
            conf: "99.1%", 
            img: "assets/images/carton.jpg" // <--- IMAGEN LOCAL
        },
        { 
            name: "Residuo Peligroso", 
            conf: "99.9%", 
            img: "assets/images/peligroso.jpg" // <--- IMAGEN LOCAL
        }
    ];

    // Iniciar Animación
    placeholder.style.display = 'none';
    imgElement.style.display = 'none';
    laser.style.display = 'block';
    title.innerText = "Analizando...";
    title.style.color = "#fff";
    conf.innerText = "Procesando...";

    setTimeout(() => {
        const item = items[Math.floor(Math.random() * items.length)];
        
        // Mostrar resultado
        laser.style.display = 'none';
        imgElement.src = item.img;
        imgElement.style.display = 'block';
        title.innerText = item.name;
        title.style.color = item.name.includes("Peligroso") ? "#ff4444" : "#00ffff";
        conf.innerText = "Confianza: " + item.conf;

        // Agregar a la tabla
        if(tableBody) {
            const now = new Date();
            const time = now.toLocaleTimeString('es-MX', { hour12: false });
            const id = "EVT-" + Math.floor(1000 + Math.random() * 9000);
            
            const row = `
                <tr>
                    <td>${time}</td>
                    <td style="font-family: monospace; color: #888;">${id}</td>
                    <td>${item.name}</td>
                    <td><span style="color: #0f0;">${item.conf}</span></td>
                    <td><span style="border: 1px solid #0f0; color: #0f0; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem;">SYNCED</span></td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('afterbegin', row);
        }
    }, 2000);
};

// 4. FUNCIÓN PARA MOVER EL MAPA
function focusMap(lat, lng, title) {
    if (map) {
        map.flyTo([lat, lng], 15, { animate: true, duration: 1.5 });
        L.popup().setLatLng([lat, lng]).setContent("<b>" + title + "</b>").openOn(map);
    }
}