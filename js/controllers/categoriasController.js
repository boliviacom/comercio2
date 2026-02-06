import { CategoriasModel } from '../models/categoriasModel.js';
import { NavbarView } from '../views/navbarView.js';

export const CategoriasController = {
    async init() {
        try {
            // 1. Obtenemos todas las categorías visibles
            const todas = await CategoriasModel.fetchAllVisible();

            if (!todas || todas.length === 0) return;

            // 2. Filtramos las HIJAS para el Navbar Horizontal (Primeras 5)
            const hijasNavbar = todas
                .filter(cat => cat.id_padre !== null)
                .slice(0, 5);

            // 3. Organizamos los PADRES y les asignamos sus HIJAS correspondientes
            // Esto permite que el panel lateral sepa qué mostrar al hacer clic
            const categoriasEstructuradas = todas
                .filter(cat => cat.id_padre === null)
                .map(padre => ({
                    ...padre,
                    link: `productos.html?categoria=${encodeURIComponent(padre.nombre)}`,
                    // Buscamos todas las hijas que pertenecen a este padre
                    subcategorias: todas
                        .filter(h => h.id_padre === padre.id)
                        .map(h => ({
                            id: h.id,
                            nombre: h.nombre,
                            link: `productos.html?categoria=${encodeURIComponent(h.nombre)}`
                        }))
                }));

            // 4. Formateamos las hijas del Navbar para consistencia
            const hijasNavbarFormateadas = hijasNavbar.map(h => ({
                id: h.id,
                nombre: h.nombre,
                link: `productos.html?categoria=${encodeURIComponent(h.nombre)}`
            }));

            // 5. Enviamos a la vista: (Padres con sus subcategorias, Hijas del Navbar)
            NavbarView.render(categoriasEstructuradas, hijasNavbarFormateadas);

        } catch (error) {
            console.error("Error en CategoriasController:", error);
        }
    },

    /**
     * Método para obtener productos de una subcategoría (Hija)
     * Este lo llamará la vista cuando el usuario llegue al nivel 3
     */
    async obtenerProductosPorCategoria(categoriaId) {
        try {
            // Aquí llamarías a tu ProductosModel (si lo tienes) o directo a supabase
            // Ejemplo rápido:
            /*
            const { data } = await supabase
                .from('productos')
                .select('*')
                .eq('id_categoria', categoriaId)
                .limit(4);
            return data;
            */
            return []; // Por ahora devolvemos vacío para el skeleton
        } catch (error) {
            console.error("Error al obtener productos:", error);
            return [];
        }
    }
};