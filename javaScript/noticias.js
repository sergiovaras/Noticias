// Usamos el endpoint oficial de datos JSON de la API abierta (CORS libre para navegadores)
const API_URL = "https://spaceflightnewsapi.net";

async function actualizarTitularesGlovales() {
    const contenedorFeed = document.getElementById("live-news-feed");
    if (!contenedorFeed) return;

    try {
        const peticion = await fetch(API_URL);
        
        if (!peticion.ok) {
            throw new Error(`Error en la solicitud: ${peticion.status}`);
        }

        const datos = await peticion.json();

        // Estructura para renderizar los datos correctos de la nueva API abierta
        if (datos.results && datos.results.length > 0) {
            contenedorFeed.innerHTML = "";
            const ultimasNoticias = datos.results.slice(0, 5);

            ultimasNoticias.forEach(articulo => {
                const itemNoticia = document.createElement("li");

                // Mapeamos las propiedades nativas de la API: news_site y url
                const medioOrigen = articulo.news_site ? articulo.news_site.toUpperCase() : 'NOTICIA';  
            
                itemNoticia.innerHTML = ` 
                    <a href="${articulo.url}" target="_blank" rel="noopener noreferrer">
                        <strong>[${medioOrigen}]</strong> ${articulo.title}
                    </a>
                `;
                contenedorFeed.appendChild(itemNoticia);
            });
        } else {
            contenedorFeed.innerHTML = "<li>No se encontraron noticias recientes.</li>";
        }   
    } catch (error) {
        console.error("Error al obtener las noticias:", error);
        contenedorFeed.innerHTML = "<li>Error al cargar las noticias. Por favor, inténtelo más tarde.</li>";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    actualizarTitularesGlovales();

    // Consulta automática en segundo plano cada 3 minutos sin refrescar la pantalla
    setInterval(actualizarTitularesGlovales, 180000);

    // Vinculación segura del botón de actualización manual
    const botonRefrescar = document.getElementById("refresh-news");
    if (botonRefrescar) {
        botonRefrescar.addEventListener("click", () => {
            actualizarTitularesGlovales();
        });
    }
});
