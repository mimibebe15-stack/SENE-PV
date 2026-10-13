# SENE/P.V — Compilación de APK con GitHub

Este proyecto crea un APK Android de prueba mediante GitHub Actions. El APK conserva las funciones web de SENE/P.V: inventario, ventas, archivos de inventario y enlace a WhatsApp.

## Crear el APK

1. Crea una cuenta en [GitHub](https://github.com) si aún no tienes una.
2. Pulsa **New repository** y crea un repositorio, por ejemplo `sene-pv`.
3. Elige **Public** o **Private** y pulsa **Create repository**.
4. En el repositorio, pulsa **Add file → Upload files**.
5. Sube todos los archivos y carpetas de esta carpeta `sene-pv`. Deben incluirse `.github`, `scripts`, `app.js`, `index.html`, `styles.css`, `package.json` y `capacitor.config.json`.
6. Pulsa **Commit changes**. El flujo se ejecuta al enviar cambios a la rama `main`.
7. Abre la pestaña **Actions**. El flujo **Compilar APK SENE PV** iniciará solo. Si no aparece, entra a ese flujo y pulsa **Run workflow**.
8. Espera a que termine con una marca verde.
9. Abre la ejecución terminada. Al final está la sección **Artifacts**.
10. Descarga **SENE-PV-APK** y descomprime el archivo: dentro está `app-debug.apk`.
11. Envía `app-debug.apk` al celular e instálalo. Android puede pedir permitir instalaciones desde esa aplicación de archivos o WhatsApp.

## Notas

- GitHub crea un APK de prueba. Para publicar en Play Store se necesita firmar una versión de producción con una llave privada.
- La app pide permiso de cámara cuando el vendedor usa el escáner.
- El número de WhatsApp, productos y existencias se configuran desde **Administrador** y se comparten mediante el archivo de inventario SENE/P.V.
- En el teléfono del vendedor, abre **Stock e ingreso → Recibir inventario del administrador** para cargar el archivo recibido. Las ventas guardadas en el teléfono no se eliminan.
- El vendedor puede usar **Agregar producto o ingreso de stock → Escanear**. Si el código ya existe, la app selecciona ese producto; si no existe, solicita nombre, precio y cantidad.
- Cada dos horas la app recuerda enviar por WhatsApp un reporte con las ventas aún no reportadas. El recordatorio no bloquea las ventas.
- No subas claves, contraseñas ni archivos privados al repositorio.
