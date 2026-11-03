const API_URL =  "https://newsdata.io";

async function actualizarTitularesGlovales() {
    const contenedorFeed = document.getElementById("live-news-feed");

    try {
        const peticion = await fetch(API_URL);
        if (!peticion.ok) {
            throw new Error(`Error en la solicitud: ${peticion.status}`);
        }

        ///verificamos que la API decuelva resultados validos///
        if (datos.results && datos.results.length > 0) {
            contenedorFeed.innerHTML = "";
            // limitamos a mostrar un maximo de 5 noticias para no saturar la pagina //
            const ultimasNoticias = datos.results.slice(0, 5);

            ultimasNoticias.forEach(articulo => {
                const itemNoticia = document.createElement("li");

            //formateamos el nombre del periodico o fuente de origen//
                const medioOrigen = articulo.news_site ? articulo.news_site.toUpperCase() : 'NOTICIA';  
            
            //Estrutura del enlace que abrira en pestaña  nueva//
            itemNoticia.innerHTML = ` 
                <a href="${articulo.link}" target="_blank" rel="noopener noreferrer">
                        <strong>[${medioOrigen}]</strong> ${articulo.title}
                </a>
            `;
            contenedorFeed.appendChild(itemNoticia);
            });
        }else{
            contenedorFeed.innerHTML = "<li>No se encontraron noticias recientes.</li>";
        }   
    }catch (error) {
        console.error("Error al obtener las noticias:", error);
        contenedorFeed.innerHTML = "<li>Error al cargar las noticias. Por favor, inténtelo más tarde.</li>";
    }
}

document.addEventListener("DOMContentLoaded", () =>{

    actualizarTitularesGlovales();
//Dinamico: ejecuta la consulta automaticamente en segundo plano cada 3 minuto//
   setInterval(actualizarTitularesGlovales, 180000) ;

//Vinculacion del boton de actualizacion manual por si el usuario quiere  refrescar
   const botonRefrescar = document.getElementById("refresh-news");
   botonRefrescar.addEventListener("click", () => {
       actualizarTitularesGlovales();
   });
});   