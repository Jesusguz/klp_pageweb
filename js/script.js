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
menuToggle.addEventListener('mouseover', toggleMenu);
menuToggle.addEventListener('mouseout', toggleMenu);

// Cerrar el menú al hacer clic fuera de él
document.addEventListener('click', (event) => {
    const isClickInsideMenu = menuToggle.contains(event.target) || navUl.contains(event.target);
    if (!isClickInsideMenu && navUl.classList.contains('active')) {
        navUl.classList.remove('active');
    }
});