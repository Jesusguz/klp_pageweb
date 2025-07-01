
document.querySelectorAll('a[href^="#"]:not(nav ul li a)').forEach(anchor  => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});



/* En tu archivo script.js */
const menuToggle = document.querySelector('.menu-toggle');
const navUl = document.querySelector('nav ul');

// Función para alternar la visibilidad del menú
function toggleMenu() {
    navUl.classList.toggle('active');
}

// Eventos para mostrar/ocultar el menú
menuToggle.addEventListener('click', toggleMenu);
//menuToggle.addEventListener('mouseover', toggleMenu);
//menuToggle.addEventListener('mouseout', toggleMenu);

// Cerrar el menú al hacer clic fuera de él
document.addEventListener('click', (event) => {
    const isClickInsideMenu = menuToggle.contains(event.target) || navUl.contains(event.target);
    if (!isClickInsideMenu && navUl.classList.contains('active')) {
        navUl.classList.remove('active');
    }
});

/*

function fetchVideosFromSpreadsheet() {
    const spreadsheetId = '1aollq50weBDkfcvqoUefI0XOj3HT4YjrtxekfF6QT7c';
    const range = 'Pagina!A2:A16';

    const apiUrl = 'https://sheets.googleapis.com/v4/spreadsheets/';
    const apiKey = 'AIzaSyCVCG0g7f0SYAm5TdNljWkr19l4G9ZZbAE';

    const requestUrl = `${apiUrl}${spreadsheetId}/values/${range}?key=${apiKey}`;

    fetch(requestUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }
            return response.json();
        })
        .then(data => {
            const videoUrls = data.values.map(row => {
                let url = row[0]; //  URLs están en la primera columna

                // Convierte la URL de visualización a URL de incrustación
                if (url.includes('watch?v=')) {
                    const videoId = url.split('watch?v=')[1];
                    url = `https://www.youtube.com/embed/${videoId}`;
                }

                return url;
            });

            const iframe = document.querySelector('.video-container iframe');
            let currentVideoIndex = 0;

            function updateIframeSrc() {
                if (currentVideoIndex < videoUrls.length) {
                    iframe.src = videoUrls[currentVideoIndex];
                    currentVideoIndex++;
                } else {
                    console.log('No hay más videos disponibles.');
                }
            }

            updateIframeSrc();
        })
        .catch(error => {
            console.error('Error al obtener los videos:', error);
        });
}

function parseCsvData(csvData) {
    const rows = csvData.split('\n');
    const videoUrls = rows.map(row => row.trim().replace(/"/g, '')); // Elimina comillas y espacios en blanco

    return videoUrls;
}

window.onload = fetchVideosFromSpreadsheet;*/
let player;
let videoUrls = [];
let currentVideoIndex = 0;

// 1. La API de YouTube llamará a esta función cuando esté lista.
function onYouTubeIframeAPIReady() {
    console.log("Paso 1: La API de YouTube está lista.");
    fetchVideosFromSpreadsheet();
}

// 2. Función para obtener los videos desde Google Sheets.
function fetchVideosFromSpreadsheet() {
    console.log("Paso 2: Buscando videos en Google Sheets...");
    const spreadsheetId = '1aollq50weBDkfcvqoUefI0XOj3HT4YjrtxekfF6QT7c';
    const range = 'Pagina!A2:A16';
    const apiKey = 'AIzaSyCVCG0g7f0SYAm5TdNljWkr19l4G9ZZbAE';
    const requestUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

    fetch(requestUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error de red o de API Key al llamar a Google Sheets.');
            }
            return response.json();
        })
        .then(data => {
            if (!data.values) {
                 console.error("Error: No se encontraron valores en la hoja de cálculo. Revisa el ID, el rango y los permisos.");
                 return;
            }
            console.log("Paso 3: Videos encontrados. Extrayendo IDs.");
            
            // --- INICIO DE LA CORRECCIÓN ---
            videoUrls = data.values.map(row => {
                const url = row[0];
                if (!url) return null;

                let videoId = null;
                // Intenta extraer el ID de diferentes formatos de URL de YouTube
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                const match = url.match(regExp);

                if (match && match[2].length === 11) {
                    videoId = match[2];
                }
                
                return videoId;
            }).filter(id => id !== null); // Filtra los que no se pudieron procesar
            // --- FIN DE LA CORRECCIÓN ---

            if (videoUrls.length > 0) {
                console.log(`IDs de video encontrados: ${videoUrls.join(', ')}`);
                createPlayer(videoUrls[0]); // Carga el primer video
            } else {
                console.error("No se encontraron IDs de video válidos en la hoja.");
            }
        })
        .catch(error => {
            console.error("FALLO CATASTRÓFICO en fetchVideosFromSpreadsheet:", error);
        });
}

// 3. Función que crea el reproductor.
function createPlayer(videoId) {
    console.log(`Paso 4: Creando el reproductor para el video ID: ${videoId}`);
    player = new YT.Player('youtube-player', { // Apunta al div con id="youtube-player"
        height: '315',
        width: '560',
        videoId: videoId,
        playerVars: {
            'playsinline': 1,
            'autoplay': 0, // 0 para no iniciar automáticamente, 1 para sí
            'rel': 0,
            'controls': 1,
            'modestbranding': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// 4. Se ejecuta cuando el reproductor está listo.
function onPlayerReady(event) {
    console.log("Paso 5: El reproductor está listo (onPlayerReady).");
    // event.target.playVideo(); // Descomenta esta línea si quieres que el video inicie solo
}

// 5. Se ejecuta cuando el estado del video cambia (play, pausa, fin).
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        console.log("Video terminado. Cargando el siguiente.");
       /* currentVideoIndex++;
        if (currentVideoIndex < videoUrls.length) {
            player.loadVideoById(videoUrls[currentVideoIndex]);
        } else {
            console.log("Fin de la lista. Reiniciando el primer video.");
            currentVideoIndex = 0; // Vuelve al inicio de la lista
            player.loadVideoById(videoUrls[currentVideoIndex]);
        }*/
    }
}