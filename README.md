# JOGA

JOGA es una plataforma mobile-first para organizar fútbol amateur y callejero: encontrar partidos, crear pichangas, anotarse, administrar lista de espera y construir una identidad de jugador.

## Stack y estructura

- **Frontend:** HTML, CSS y JavaScript sin framework; pensado primero para celular.
- **Hosting:** GitHub Pages (publicación desde el repositorio).
- **Auth, base de datos y storage:** Supabase.
- **Offline:** service worker `sw.js` con cache versionada.
- **`index.html`:** estructura, vistas, navegación y formularios.
- **`app.js`:** sesión, perfil, personalización, auth y estadísticas.
- **`matches.js`:** búsqueda, filtros, creación, inscripción, lista de espera y detalles.
- **`style.css`:** estilos globales y mobile.
- **`supabase/migrations/`:** cambios de esquema y funciones SQL.

## Funciones actuales

- Registro, inicio de sesión, confirmación por email y recuperación de contraseña.
- Perfil de jugador, foto, usuario, privacidad y datos opcionales.
- Creación de partidos públicos; modalidad, fecha/hora, localidad, cancha, precio, límites de edad, descripción y lista de espera.
- Inscripción, baja, lista de espera y cancelación por organizador.
- Búsqueda de partidos y filtros combinables por modalidad y costo.
- Personalización e inventario cosmético en Supabase. El trabajo de los avatar rings está en pausa hasta revisar visualmente los assets en el teléfono.

## Publicación

El sitio se publica desde GitHub Pages. Los cambios en `main` se reflejan tras la publicación del hosting. Para cambios de assets o scripts, comprobar la versión cacheada del service worker (`V` en `sw.js`) y actualizarla cuando sea necesario para evitar que el móvil conserve recursos antiguos.

## Supabase

El cliente usa la URL del proyecto y una **publishable key** en el frontend. Nunca incluir una `service_role` key ni secretos en archivos públicos.

Las migraciones guardadas en `supabase/migrations/` deben revisarse y aplicarse en el proyecto de prueba correspondiente antes de llevar cambios de base de datos a producción. No ejecutar migraciones automáticamente desde el frontend.

## QA rápido antes de publicar

1. Revisar sintaxis de `app.js` y `matches.js`.
2. Confirmar que cada ID usado desde JavaScript exista en el HTML o sea creado dinámicamente.
3. Probar con cuenta autenticada: búsqueda, filtros, crear partido, ver detalles, sumarse, salir, lista de espera y cancelación.
4. Probar validaciones: modalidad personalizada, rango de edad, fecha/hora futura, precio y campos obligatorios.
5. Revisar perfil, editar perfil, cambio de foto y logout/login.
6. Probar móvil: pantalla chica, teclado, scroll de formularios, safe areas y cache limpia.

## Pendientes conocidos

- **Avatar rings:** pausar los cambios de diseño/recorte; verificar el resultado visual en un dispositivo antes de continuar.
- **Calle/comunidad:** vista placeholder para una futura etapa.
- **Privados/invitaciones:** todavía no habilitados.
- **Cosméticos animados:** postergados; primero terminar bien los frames estáticos.

