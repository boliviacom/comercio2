export const ConfigView = {
    applyColors(p) {
        if (!p) return;
        const root = document.documentElement;

        // Mapeo directo de tus nuevos nombres de columna a variables CSS
        root.style.setProperty('--color-primary', p.primary_color);
        root.style.setProperty('--color-secondary', p.secondary_color);
        root.style.setProperty('--color-accent', p.accent_color);
        root.style.setProperty('--color-primary-dark', p.primary_dark_color);
        root.style.setProperty('--color-bg-light', p.background_light_color);
        root.style.setProperty('--color-bg-dark', p.background_dark_color);
        root.style.setProperty('--color-surface-dark', p.surface_dark_color);

        console.log(`🎨 Paleta "${p.nombre}" aplicada.`);
    },

    updateGeneralSettings(settings) {
        settings.forEach(conf => {
            if (conf.clave === 'site_logo') {
                document.querySelectorAll('img[alt*="Logo"]').forEach(img => img.src = conf.valor_actual);
            }
            if (conf.clave === 'site_name') {
                document.title = conf.valor_actual;
            }
        });
    }
};