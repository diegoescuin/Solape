# Solape

Vercel sirve la aplicación web. Supabase guarda los reportes, las inyectoras, sus imágenes y los jefes de equipo.

1. En Supabase, abre **Authentication → Users** y crea una cuenta con correo y contraseña exclusiva para Solape. Marca el correo como confirmado. Copia el **User UID**.
2. En **SQL Editor → New query**, pega el archivo **supabase/migrations/20261121000000_create_solape_state.sql**. Sustituye las tres apariciones del UUID de ceros por el UID de esa cuenta y pulsa **Run**. La política da acceso a esa cuenta y la migración solo modifica la tabla de Solape.
3. Rellena **supabase-config.js** con la URL HTTPS del proyecto y su clave pública **sb_publishable_…**. La contraseña y las claves secretas quedan fuera de GitHub.
4. Sube el contenido de esta carpeta al repositorio privado de Solape e impórtalo en Vercel. Selecciona **Other**, usa la raíz del repositorio y deja vacíos el comando de compilación y el directorio de salida.
5. Entra en la URL de Vercel. Añade un jefe de equipo en **Configuración → Personas**, guarda un reporte y comprueba que se ve desde el móvil al iniciar sesión.

Solape empieza con las inyectoras de ejemplo y sin informes ni jefes. Los registros de la versión local y los datos de demostración no se importan. Si otra sesión ha guardado cambios desde que entraste, vuelve a entrar y repite el guardado para evitar sobrescribirlos.
