import { carruselModel } from '../models/carruselModel.js';
export const carruselController = {
    async obtenerContenidoGlobal() {
        try {
            const carruseles = await carruselModel.listarConItems();
            return carruseles.map(carrusel => ({
                ...carrusel,
                items: this._formatearItems(carrusel.items)
            }));
        } catch (error) {
            console.error("Error al cargar contenido de carruseles:", error);
            return [];
        }
    },

    /**
     * Obtiene un carrusel específico por su ubicación (ej: 'home-hero')
     */
    async obtenerPorUbicacion(slug) {
        try {
            const data = await carruselModel.obtenerPorUbicacion(slug);

            if (!data || data.length === 0) {
                console.warn(`3. Controlador: No se encontró carrusel activo con slug: "${slug}"`);
                return null;
            }

            const carrusel = data[0];
            const formateados = this._formatearItems(carrusel.items);

            return {
                ...carrusel,
                items: formateados
            };
        } catch (error) {
            console.error("Error en Controlador:", error);
            return null;
        }
    },

    _formatearItems(itemsRaw) {
        if (!itemsRaw) return [];

        return itemsRaw.map(item => {
            const esProducto = !!item.producto;
            const esCategoria = !!item.categoria;

            return {
                id: item.id,
                orden: item.orden,
                titulo: item.titulo_manual || item.producto?.nombre || item.categoria?.nombre || '',
                subtitulo: item.subtitulo_manual || (item.producto?.precio ? `$ ${item.producto.precio}` : ''),
                imagen: item.imagen_url_manual || item.producto?.imagen_url || item.categoria?.imagen || null,

                // CAMBIO: Usamos ID si el slug no existe en la tabla
                link: item.link_destino_manual ||
                    (esProducto ? `/producto.html?id=${item.producto.id}` :
                        (esCategoria ? `/categoria.html?id=${item.categoria.id}` : '#')),

                tipo: esProducto ? 'producto' : (esCategoria ? 'categoria' : 'manual')
            };
        });
    }
};