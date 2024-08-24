// Ejemplo de función para mejorar la navegación (smooth scrolling)
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

window.onload = fetchVideosFromSpreadsheet;