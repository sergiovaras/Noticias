document.addEventListener("DOMContentLoaded", () => {

    const feed = document.getElementById("live-news-feed");
    const urgentFeed = document.getElementById("urgent-news-feed");
    const btnRefresh = document.getElementById("refresh-news");
    const navLinks = document.querySelectorAll(".nav-link");
    const citySelector = document.getElementById("city-selector");
    const weatherInfo = document.getElementById("weather-info");

    const API_KEY = "pub_9eb7a524f818492c8713c25f2331d335";
    let categoriaActual = "world";

    // --- FUNCIÓN DE CLIMA Y PRONÓSTICO ---
    async function cargarClima(latLon) {
        try {
            const [lat, lon] = latLon.split(",");
            const urlClima = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`;

            const respuesta = await fetch(urlClima);
            if (!respuesta.ok) throw new Error("No se pudo obtener el clima");
            
            const data = await respuesta.json();
            
            // Códigos de clima básicos de Open-Meteo para mostrar iconos/descripciones
            const obtenerEstadoClima = (code) => {
                if (code === 0) return { texto: "Despejado ☀️", icono: "☀️" };
                if (code >= 1 && code <= 3) return { texto: "Parcialmente nublado ⛅", icono: "⛅" };
                if (code >= 45 && code <= 48) return { texto: "Neblina 🌫️", icono: "🌫️" };
                if (code >= 51 && code <= 67) return { texto: "Lluvia 🌧️", icono: "🌧️" };
                if (code >= 71 && code <= 77) return { texto: "Nieve ❄️", icono: "❄️" };
                if (code >= 95) return { texto: "Tormenta ⚡", icono: "⚡" };
                return { texto: "Nublado ☁️", icono: "☁️" };
            };

            const actual = data.current;
            const hoyMax = data.daily.temperature_2m_max[0];
            const hoyMin = data.daily.temperature_2m_min[0];
            const estado = obtenerEstadoClima(actual.weather_code);

            weatherInfo.innerHTML = `
                <div class="weather-main">
                    <span class="weather-temp">${Math.round(actual.temperature_2m)}°C</span>
                    <span class="weather-desc">${estado.texto}</span>
                </div>
                <div style="font-size: 0.8rem; color: #64748b; display: flex; justify-content: space-between; margin-top: 4px;">
                    <span>Máx: <strong>${Math.round(hoyMax)}°C</strong> | Mín: <strong>${Math.round(hoyMin)}°C</strong></span>
                    <span>Humedad: ${actual.relative_humidity_2m}%</span>
                </div>
            `;
        } catch (error) {
            console.error("Error al cargar clima:", error);
            weatherInfo.innerHTML = `<p style="color:red; font-size:0.85rem;">⚠️ No se pudo cargar el clima.</p>`;
        }
    }

    // Evento al cambiar de ciudad en el selector
    if (citySelector) {
        citySelector.addEventListener("change", (e) => {
            cargarClima(e.target.value);
        });
    }

    // --- FUNCIÓN DE NOTICIAS ---
    async function actualizarTitularesGlobales(categoria = "world") {
        categoriaActual = categoria;

        try {
            feed.innerHTML = `
                <div class="card loading-card">
                    <p>🔄 Cargando noticias en tiempo real...</p>
                </div>
            `;

            const url = `https://newsdata.io/api/1/latest?apikey=${API_KEY}&country=ar,br,co,sv,fr&language=es,en&category=${categoria}`;

            const respuesta = await fetch(url);

            if (!respuesta.ok) {
                throw new Error(`HTTP ${respuesta.status}`);
            }

            const datos = await respuesta.json();

            feed.innerHTML = "";

            if (!datos.results || datos.results.length === 0) {
                feed.innerHTML = `<div class="card"><p>No se encontraron noticias para esta categoría.</p></div>`;
                return;
            }

            // 1. CARGAR FEED PRINCIPAL (Tarjetas con imagen)
            datos.results.slice(0, 10).forEach(noticia => {
                const article = document.createElement("article");
                article.className = "card";

                const imagenNoticia = noticia.image_url 
                    ? noticia.image_url 
                    : "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400&auto=format&fit=crop&q=60";

                const descripcion = noticia.description || "Haz clic abajo para leer la cobertura completa de esta noticia global en tiempo real.";

                article.innerHTML = `
                    <img src="${imagenNoticia}" alt="Noticia" class="card-image" onerror="this.src='https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400&auto=format&fit=crop&q=60'">
                    <div class="card-content">
                        <div>
                            <span class="badge">${categoria.toUpperCase()}</span>
                            <h3>${noticia.title}</h3>
                            <p>${descripcion}</p>
                        </div>
                        <a href="${noticia.link}" target="_blank" rel="noopener noreferrer" class="read-more">
                            Leer noticia completa →
                        </a>
                    </div>
                `;

                feed.appendChild(article);
            });

            // 2. CARGAR BARRA LATERAL (Destacadas / Urgentes)
            if (urgentFeed) {
                urgentFeed.innerHTML = "";
                
                datos.results.slice(0, 4).forEach(noticia => {
                    const article = document.createElement("article");
                    article.className = "sidebar-card";

                    article.innerHTML = `
                        <span class="urgent-tag">🚨 ÚLTIMA HORA</span>
                        <h4>${noticia.title}</h4>
                        <a href="${noticia.link}" target="_blank" rel="noopener noreferrer" class="read-more-sm">
                            Leer más →
                        </a>
                    `;

                    urgentFeed.appendChild(article);
                });
            }

        } catch (error) {
            console.error("Error en actualizarTitularesGlobales:", error);
            feed.innerHTML = `<div class="card" style="border-left-color: #e74c3c;"><p style="color:red;">❌ Error al cargar noticias.</p></div>`;
        }
    }

    if (btnRefresh) {
        btnRefresh.addEventListener("click", () => actualizarTitularesGlobales(categoriaActual));
    }

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.style.color = "#fff");
            link.style.color = "#3498db";
            
            const menuCheck = document.getElementById("menu-check");
            if (menuCheck) menuCheck.checked = false;

            const cat = link.getAttribute("data-category");
            actualizarTitularesGlobales(cat);
        });
    });

    // Carga inicial al abrir la página
    cargarClima(citySelector ? citySelector.value : "-34.9214,-57.9545");
    actualizarTitularesGlobales("world");

    // Actualización automática cada 5 minutos
    setInterval(() => actualizarTitularesGlobales(categoriaActual), 300000);
});