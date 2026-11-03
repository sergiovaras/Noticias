// Tu URL exacta de NewsData.io combinada con el proxy para que funcione en GitHub Pages
const API_URL = "https://herokuapp.com";

async function actualizarTitularesGlobales() {
    const contenedorFeed = document.getElementById("live-news-feed");
    if (!contenedorFeed) return;

    try {
        const peticion = await fetch(API_URL);
        
        if (!peticion.ok) {
            throw new Error(`Error en la solicitud de noticias: ${peticion.status}`);
        }

        const datos = await peticion.json();

        // Validamos que el servidor de NewsData devuelva resultados válidos
        if (datos.results && datos.results.length > 0) {
            contenedorFeed.innerHTML = "";
            
            // Limitamos a mostrar un máximo de 5 titulares en tu barra lateral
            const ultimasNoticias = datos.results.slice(0, 5);

            ultimasNoticias.forEach(articulo => {
                const itemNoticia = document.createElement("li");

                // Mapeamos el nombre del periódico original (ej: CLARIN, EL PAIS, etc.)
                const medioOrigen = articulo.source_id ? articulo.source_id.toUpperCase() : 'NOTICIA';  
            
                // Inyectamos el enlace original y el título de la noticia
                itemNoticia.innerHTML = ` 
                    <a href="${articulo.link}" target="_blank" rel="noopener noreferrer">
                        <strong>[${medioOrigen}]</strong> ${articulo.title}
                    </a>
                `;
                contenedorFeed.appendChild(itemNoticia);
            });
        } else {
            contenedorFeed.innerHTML = "<li>No se encontraron noticias recientes con esos filtros.</li>";
        }   
    } catch (error) {
        console.error("Error al obtener las noticias:", error);
        contenedorFeed.innerHTML = "<li>Error al cargar las noticias de última hora.</li>";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    actualizarTitularesGlobales();

    // Dinámico: Consulta automáticamente a NewsData en segundo plano cada 3 minutos
    setInterval(actualizarTitularesGlobales, 180000);

    // Vinculación del botón de refresco manual
    const botonRefrescar = document.getElementById("refresh-news");
    if (botonRefrescar) {
        botonRefrescar.addEventListener("click", actualizarTitularesGlobales);
    }
});


