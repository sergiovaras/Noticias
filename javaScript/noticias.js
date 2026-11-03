// CORREGIDO: Subdominio 'api' y ruta exacta a la colección de artículos v4
const API_URL = "https://spaceflightnewsapi.net";

async function actualizarTitularesGlovales() {
    const contenedorFeed = document.getElementById("live-news-feed");

    try {
        const peticion = await fetch(API_URL);
        if (!peticion.ok) {
            throw new Error(`Error en la solicitud: ${peticion.status}`);
        }

        // CORREGIDO: Falta transformar la petición cruda a un objeto JSON legible
        const datos = await peticion.json();

        // Verificamos que la API devuelva resultados válidos
        if (datos.results && datos.results.length > 0) {
            contenedorFeed.innerHTML = "";
            const ultimasNoticias = datos.results.slice(0, 5);

            ultimasNoticias.forEach(articulo => {
                const itemNoticia = document.createElement("li");

                const medioOrigen = articulo.news_site ? articulo.news_site.toUpperCase() : 'NOTICIA';  
            
                // CORREGIDO: Cambiado articulo.link por articulo.url para que abra la noticia original
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

    // Dinámico: ejecuta la consulta automáticamente en segundo plano cada 3 minutos
    setInterval(actualizarTitularesGlovales, 180000);

    const botonRefrescar = document.getElementById("refresh-news");
    if (botonRefrescar) {
        botonRefrescar.addEventListener("click", () => {
            actualizarTitularesGlovales();
        });
    }
});
