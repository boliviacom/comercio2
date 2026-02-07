export const NavbarView = {
    _datosCompletos: [],

    render(padresConHijas, hijasNavbar) {
        this._datosCompletos = padresConHijas;
        this._renderHorizontalLinks(hijasNavbar);
        this._renderDropdownAcordeon(padresConHijas);
        this._initEventListeners();
    },

    _renderHorizontalLinks(hijas) {
        const container = document.getElementById('main-nav-links');
        if (!container) return;
        container.innerHTML = `
            <a class="text-white hover:text-white/90 hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-all relative group" href="index.html">
                Inicio
                <span class="absolute bottom-1.5 left-3 right-3 h-0.5 bg-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </a>
        `;
        hijas.forEach(cat => {
            container.insertAdjacentHTML('beforeend', `
                <a class="text-white hover:text-white/90 hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-all relative group uppercase tracking-tighter" href="${cat.link}">
                    ${cat.nombre}
                    <span class="absolute bottom-1.5 left-3 right-3 h-0.5 bg-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </a>
            `);
        });
    },

    _renderDropdownAcordeon(padres) {
        const container = document.getElementById('dropdown-links-container');
        if (!container) return;
        
        container.className = "py-2 max-h-[70vh] overflow-y-auto scrollbar-hide"; 
        container.innerHTML = '';

        padres.forEach(padre => {
            const wrapper = document.createElement('div');
            wrapper.className = "border-b border-gray-50 last:border-0";
            
            wrapper.innerHTML = `
                <div class="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer group padre-trigger" data-id="${padre.id}">
                    <span class="text-sm font-bold text-gray-700 group-hover:text-primary transition-colors uppercase tracking-tight pointer-events-none">
                        ${padre.nombre}
                    </span>
                    <span class="material-icons text-gray-400 group-hover:text-primary transition-transform duration-300 arrow-icon pointer-events-none">expand_more</span>
                </div>
                
                <div class="hidden bg-gray-50/50 flex-col overflow-hidden" id="collapse-${padre.id}">
                    ${padre.subcategorias.map(hija => `
                        <div class="flex items-center justify-between pl-8 pr-4 py-2.5 hover:bg-white cursor-pointer group/hija hija-trigger" 
                             data-nombre="${hija.nombre}" data-id="${hija.id}">
                            <span class="text-xs font-medium text-gray-500 group-hover/hija:text-primary transition-colors pointer-events-none">
                                ${hija.nombre}
                            </span>
                            <span class="material-icons text-base text-gray-300 opacity-0 group-hover/hija:opacity-100 transition-all pointer-events-none">chevron_right</span>
                        </div>
                    `).join('')}
                </div>
            `;
            container.appendChild(wrapper);
        });

        this._injectSubMenuContainer();
    },

    _injectSubMenuContainer() {
        if (document.getElementById('sub-menu-products')) return;
        const parentMenu = document.getElementById('categories-dropdown-menu');
        
        // IMPORTANTE: Permitir que el sub-menú se vea fuera del contenedor principal
        parentMenu.classList.add('overflow-visible');

        const subMenu = document.createElement('div');
        subMenu.id = 'sub-menu-products';
        subMenu.className = "absolute top-0 left-full ml-4 w-72 bg-white shadow-2xl rounded-xl border border-gray-100 hidden z-[100] h-full flex flex-col overflow-hidden transition-all duration-300";
        parentMenu.appendChild(subMenu);
    },

    _initEventListeners() {
        const toggle = document.getElementById('categories-toggle');
        const menu = document.getElementById('categories-dropdown-menu');
        const arrow = document.getElementById('categories-arrow');
        const subMenu = document.getElementById('sub-menu-products');

        if (!toggle) return;

        // Abrir/Cerrar Menú Principal
        toggle.onclick = (e) => {
            e.stopPropagation();
            if (menu.classList.contains('hidden')) {
                menu.classList.remove('hidden');
                setTimeout(() => {
                    menu.classList.replace('opacity-0', 'opacity-100');
                    menu.classList.replace('scale-95', 'scale-100');
                }, 10);
                arrow?.classList.add('rotate-180');
            } else {
                this._closeAll(menu, subMenu, arrow);
            }
        };

        // Delegación de eventos para clics en el documento
        document.addEventListener('click', (e) => {
            // 1. Clic en PADRE (Acordeón)
            const padreBtn = e.target.closest('.padre-trigger');
            if (padreBtn) {
                e.stopPropagation();
                const id = padreBtn.dataset.id;
                const collapse = document.getElementById(`collapse-${id}`);
                const arrowIcon = padreBtn.querySelector('.arrow-icon');
                
                // Toggle visual
                collapse.classList.toggle('hidden');
                arrowIcon?.classList.toggle('rotate-180');
                return;
            }

            // 2. Clic en HIJA (Abrir Panel de Productos)
            const hijaBtn = e.target.closest('.hija-trigger');
            if (hijaBtn) {
                e.stopPropagation();
                this._showProductsPreview(hijaBtn.dataset.nombre);
                return;
            }

            // 3. Clic fuera para cerrar todo
            if (menu && !menu.contains(e.target) && e.target !== toggle) {
                this._closeAll(menu, subMenu, arrow);
            }
        });
    },

    async _showProductsPreview(nombreHija) {
        const subMenu = document.getElementById('sub-menu-products');
        if (!subMenu) return;

        // Mostrar el contenedor primero
        subMenu.classList.remove('hidden');
        
        // Pequeño delay para la animación de entrada
        setTimeout(() => {
            subMenu.classList.remove('opacity-0', 'translate-x-4');
            subMenu.classList.add('opacity-100', 'translate-x-0');
        }, 10);

        subMenu.innerHTML = `
            <div class="p-4 border-b border-gray-50 bg-primary text-white flex justify-between items-center shrink-0">
                <h4 class="font-black text-[10px] uppercase tracking-widest truncate mr-2">${nombreHija}</h4>
                <button class="hover:bg-white/20 rounded-full p-1 transition-colors flex items-center justify-center close-sub-btn">
                    <span class="material-icons text-sm">close</span>
                </button>
            </div>
            <div class="p-4 space-y-3 overflow-y-auto flex-grow bg-white scrollbar-hide" id="modal-products-content">
                <div class="animate-pulse space-y-3">
                    <div class="flex gap-3"><div class="w-10 h-10 bg-gray-100 rounded"></div><div class="flex-1 h-3 bg-gray-50 mt-3 rounded"></div></div>
                    <div class="flex gap-3"><div class="w-10 h-10 bg-gray-100 rounded"></div><div class="flex-1 h-3 bg-gray-50 mt-3 rounded"></div></div>
                </div>
            </div>
            <div class="p-4 bg-gray-50 border-t shrink-0">
                <a href="productos.html?categoria=${encodeURIComponent(nombreHija)}" class="block w-full text-center bg-gray-900 text-white text-[10px] font-bold py-2.5 rounded-lg hover:bg-primary transition-all uppercase tracking-widest shadow-md">
                    Ver Todo
                </a>
            </div>
        `;

        // Botón cerrar del panel lateral
        subMenu.querySelector('.close-sub-btn').onclick = (e) => {
            e.stopPropagation();
            subMenu.classList.add('hidden', 'opacity-0', 'translate-x-4');
        };

        this._renderMockProducts();
    },

    _renderMockProducts() {
        const content = document.getElementById('modal-products-content');
        if (!content) return;
        content.innerHTML = `
            <div class="flex items-center gap-3 p-2 hover:bg-sky-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-sky-100 group/prod">
                <div class="w-12 h-12 bg-white rounded border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                    <img src="https://via.placeholder.com/100" class="w-full h-full object-contain group-hover/prod:scale-110 transition-transform">
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-[11px] font-bold text-gray-800 uppercase leading-tight truncate">Producto de Ejemplo</p>
                    <p class="text-[10px] text-primary font-black">$0.00</p>
                </div>
            </div>
        `;
    },

    _closeAll(menu, subMenu, arrow) {
        menu.classList.replace('opacity-100', 'opacity-0');
        menu.classList.replace('scale-100', 'scale-95');
        subMenu?.classList.add('hidden', 'opacity-0', 'translate-x-4');
        arrow?.classList.remove('rotate-180');
        setTimeout(() => {
            menu.classList.add('hidden');
            // Cerrar acordeones al salir
            document.querySelectorAll('[id^="collapse-"]').forEach(el => el.classList.add('hidden'));
            document.querySelectorAll('.arrow-icon').forEach(el => el.classList.remove('rotate-180'));
        }, 300);
    }
};
