const { Filesystem, Share } = window.Capacitor ? window.Capacitor.Plugins : {};

async function guardarYEnviarPorWhatsApp(nombreArchivo, contenidoBase64) {
    try {
        if (!Filesystem || !Share) {
            throw new Error("Los plugins de Capacitor no están cargados correctamente.");
        }

        const archivoGuardado = await Filesystem.writeFile({
            path: nombreArchivo,
            data: contenidoBase64,
            directory: 'CACHE',
        });

        await Share.share({
            title: 'Enviar Ticket de Venta',
            text: 'Gracias por su compra. Adjuntamos su recibo digital.',
            url: archivoGuardado.uri,
            dialogTitle: 'Enviar por WhatsApp',
        });

    } catch (error) {
        console.error("Error al procesar el ticket:", error);
        alert("Fallo en Punto de Venta: " + error.message);
    }
}
