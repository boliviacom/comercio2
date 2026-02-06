export class LayoutController {
    static async render(basePath = './') {
        const components = [
            { id: 'layout-header', file: 'components/header.html' },
            { id: 'layout-nav', file: 'components/navbar.html' },
            { id: 'layout-footer', file: 'components/footer.html' }
        ];

        // Cargar todos los componentes en paralelo
        await Promise.all(
            components.map(comp => this.loadComponent(comp.id, `${basePath}${comp.file}`))
        );

        // Una vez cargados, inicializar los eventos de los botones
        this.initEvents();
    }

    static async loadComponent(id, url) {
        const container = document.getElementById(id);
        if (!container) return;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error loading ${url}`);
            container.innerHTML = await response.text();
        } catch (error) {
            console.error(error);
        }
    }

    static initEvents() {
        const btnOpen = document.getElementById('mobile-menu-open-button');
        const btnClose = document.getElementById('mobile-menu-close-button');
        const panel = document.getElementById('mobile-menu-panel');

        if (btnOpen && btnClose && panel) {
            btnOpen.addEventListener('click', () => {
                panel.classList.remove('hidden');
                setTimeout(() => panel.classList.remove('-translate-y-full', 'opacity-0'), 10);
            });

            btnClose.addEventListener('click', () => {
                panel.classList.add('-translate-y-full', 'opacity-0');
                setTimeout(() => panel.classList.add('hidden'), 300);
            });
        }

        // Dropdown de categorías
        const catBtn = document.getElementById('categories-toggle');
        if (catBtn) {
            catBtn.addEventListener('click', () => {
                const arrow = document.getElementById('categories-arrow');
                arrow.style.transform = arrow.style.transform === 'rotate(180deg)' ? 'rotate(0deg)' : 'rotate(180deg)';
                // Aquí podrías añadir la lógica para mostrar el menú de categorías
            });
        }
    }
}