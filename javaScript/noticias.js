document.addEventListener("DOMContentLoaded", () => {

    const feed = document.getElementById("live-news-feed");
    const btnRefresh = document.getElementById("refresh-news");

    // REEMPLAZA ÚNICAMENTE CON TU CLAVE (ej: "pub_9eb7a524...")
    const API_KEY = "pub_9eb7a524f818492c8713c25f2331d335";

    async function actualizarTitularesGlobales() {

        try {

            feed.innerHTML = `
                <li class="loading">
                    🔄 Actualizando noticias...
                </li>
            `;

            // Se arma la URL correctamente con la clave limpia y los parámetros deseados
            const url = `https://newsdata.io/api/1/latest?apikey=${API_KEY}&country=ar,br,co,sv,fr&language=es,en&category=politics,technology,sports,business,entertainment`;

            const respuesta = await fetch(url);

            if (!respuesta.ok) {
                throw new Error(`HTTP ${respuesta.status}`);
            }

            const datos = await respuesta.json();

            console.log(datos);

            feed.innerHTML = "";

            if (!datos.results || datos.results.length === 0) {

                feed.innerHTML = `
                    <li>No se encontraron noticias.</li>
                `;
                return;
            }

            datos.results.slice(0, 10).forEach(noticia => {

                const li = document.createElement("li");

                li.innerHTML = `
                    <a href="${noticia.link}"
                       target="_blank"
                       rel="noopener noreferrer">
                         ${noticia.title}
                    </a>
                `;

                feed.appendChild(li);

            });

        } catch (error) {

            console.error(
                "Error en actualizarTitularesGlobales:",
                error
            );

            feed.innerHTML = `
                <li style="color:red;">
                    ❌ Error al cargar noticias
                </li>
            `;
        }
    }

    if (btnRefresh) {
        btnRefresh.addEventListener(
            "click",
            actualizarTitularesGlobales
        );
    }

    actualizarTitularesGlobales();

    // Actualización automática cada 5 minutos
    setInterval(
        actualizarTitularesGlobales,
        300000
    );

});
