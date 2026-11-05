document.addEventListener("DOMContentLoaded", () => {

    const feed = document.getElementById("live-news-feed");
    const btnRefresh = document.getElementById("refresh-news");
    const navLinks = document.querySelectorAll(".nav-link");

    const API_KEY = "pub_9eb7a524f818492c8713c25f2331d335";
    
    // Variable para recordar qué categoría está viendo el usuario actualmente
    let categoriaActual = "world";

    // Función principal que recibe la categoría a buscar
    async function actualizarTitularesGlobales(categoria = "world") {
        categoriaActual = categoria;

        try {
            feed.innerHTML = `
                <div class="card loading-card">
                    <p>🔄 Cargando noticias de ${categoria.toUpperCase()}...</p>
                </div>
            `;

            // Construimos la URL usando la categoría seleccionada
            const url = `https://newsdata.io/api/1/latest?apikey=${API_KEY}&country=ar,br,co,sv,fr&language=es,en&category=${categoria}`;

            const respuesta = await fetch(url);

            if (!respuesta.ok) {
                throw new Error(`HTTP ${respuesta.status}`);
            }

            const datos = await respuesta.json();

            feed.innerHTML = "";

            if (!datos.results || datos.results.length === 0) {
                feed.innerHTML = `
                    <div class="card">
                        <p>No se encontraron noticias para esta categoría.</p>
                    </div>
                `;
                return;
            }

            datos.results.slice(0, 10).forEach(noticia => {
                const article = document.createElement("article");
                article.className = "card";

                const imagenNoticia = noticia.image_url 
                    ? noticia.image_url 
                    : "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400&auto=format&fit=crop&q=60";

                const descripcion = noticia.description || "Haz clic abajo para leer la cobertura completa de esta noticia global en tiempo real.";

                article.innerHTML = `
                    <img src="${imagenNoticia}" alt="Imagen de la noticia" class="card-image" onerror="this.src='https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400&auto=format&fit=crop&q=60'">
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

        } catch (error) {
            console.error("Error en actualizarTitularesGlobales:", error);
            feed.innerHTML = `
                <div class="card" style="border-left-color: #e74c3c;">
                    <p style="color:red;">❌ Error al cargar las noticias de esta categoría.</p>
                </div>
            `;
        }
    }

    // 1. Evento para el botón de actualizar manual (mantiene la categoría actual)
    if (btnRefresh) {
        btnRefresh.addEventListener("click", () => {
            actualizarTitularesGlobales(categoriaActual);
        });
    }

    // 2. Eventos para los enlaces del menú superior
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault(); // Evita que recargue la página completa o salte al '#'
            
            // Opcional: remover clase 'active' de todos y ponérsela al clickeado
            navLinks.forEach(l => l.style.color = "#fff");
            link.style.color = "#3498db"; // Color de selección

            const categoriaSeleccionada = link.getAttribute("data-category");
            actualizarTitularesGlobales(categoriaSeleccionada);
        });
    });

    // Carga inicial al abrir la página
    actualizarTitularesGlobales("world");

    // Actualización automática cada 5 minutos respetando la categoría actual
    setInterval(() => {
        actualizarTitularesGlobales(categoriaActual);
    }, 300000);

});