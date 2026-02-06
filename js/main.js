// js/main.js
import { LayoutController } from './controllers/layoutController.js';
import { carruselController } from './controllers/carruselController.js';
import { CarruselView } from './views/carruselView.js';
import { CategoriasController } from './controllers/categoriasController.js';

const App = {
    async init() {
        try {
            // 1. Cargar el Layout (Header, Nav y Footer)
            // Pasamos './' como ruta base para los fetch de los .html
            await LayoutController.render('./');

            // 2. Inicializar categorías en el Navbar
            // Esto debe ocurrir DESPUÉS de LayoutController.render
            const navContainer = document.getElementById('layout-nav');
            if (navContainer) {
                // Si el LayoutController no carga el navbar.html automáticamente, lo hacemos aquí:
                const resp = await fetch('components/navbar.html');
                const html = await resp.text();
                navContainer.innerHTML = html;
                
                // Ahora sí, llenamos el dropdown con la BD
                await CategoriasController.init();
            }

            // 3. Cargar Carruseles de la BD
            const carruseles = await carruselController.obtenerContenidoGlobal();
            
            if (carruseles && carruseles.length > 0) {
                carruseles.forEach(seccion => {
                    // Inyectamos en el <main id="carruseles-hub">
                    CarruselView.render(seccion, 'carruseles-hub');
                });
            }

        } catch (error) {
            console.error("Error al inicializar la aplicación:", error);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());