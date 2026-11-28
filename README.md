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
- Exploración y búsqueda de perfiles públicos por nombre o usuario; perfiles privados quedan ocultos salvo el propio y contexto de partido autorizado.
- Creación de partidos públicos; modalidad, fecha/hora, localidad, cancha, precio, límites de edad, descripción y lista de espera.
- Inscripción, baja, lista de espera y cancelación por organizador.
- Búsqueda de partidos y filtros combinables por modalidad, costo y fecha (hoy, próximos 7 días o finde).
- Compartir partidos públicos con link directo que abre sus detalles.
- Inicio con próximo partido, actividad del jugador, accesos rápidos y consejo futbolero diario.
- Personalización e inventario cosmético en Supabase. El trabajo de los avatar rings está en pausa hasta revisar visualmente los assets en el teléfono.

## Publicación

El sitio se publica desde GitHub Pages. Los cambios en `main` se reflejan tras la publicación del hosting. Para cambios de assets o scripts, comprobar la versión cacheada del service worker (`V` en `sw.js`) y actualizarla cuando sea necesario para evitar que el móvil conserve recursos antiguos.

## Supabase

El cliente usa la URL del proyecto y una **publishable key** en el frontend. Nunca incluir una `service_role` key ni secretos en archivos públicos.

Las migraciones guardadas en `supabase/migrations/` deben revisarse y aplicarse en el proyecto de prueba correspondiente antes de llevar cambios de base de datos a producción. No ejecutar migraciones automáticamente desde el frontend.

**Historial incompleto:** el proyecto JOGA de prueba tiene nueve migraciones base registradas en Supabase que todavía no están en este repositorio. Antes de recrear la base desde cero o sincronizar otro entorno, recuperar esas migraciones SQL y revisar el orden; no inventar una base sustituta.

## Seguridad y mantenimiento

- La política RLS de perfiles se endureció en el proyecto JOGA de prueba: perfiles privados solo son visibles al propio usuario y en contexto de partido autorizado. Migración `20261128091908_restrict_private_profile_visibility.sql`.
- En Supabase Auth, activar la protección de contraseñas filtradas (Advisor la reporta desactivada en el proyecto de prueba; pendiente antes del lanzamiento).
- Las RPC `SECURITY DEFINER` para crear, anotarse, salir, cancelar y equipar cosméticos están intencionalmente expuestas a `authenticated`; mantener sus comprobaciones de `auth.uid()` y autorización.
- No exponer claves secretas ni conceder acceso a datos privados por conveniencia.
- Los índices de las claves foráneas cosméticas se añadieron en la migración `index_cosmetic_item_fk_columns`.

## QA rápido antes de publicar

- El workflow `JOGA QA` ejecuta checks estáticos en cada push y PR: sintaxis JS, IDs duplicados, IDs referenciados, navegación, Inicio, filtros, share links y cache versioning.
- Revisar también manualmente en un teléfono: búsqueda, filtros, crear partido, ver detalles, sumarse, salir, lista de espera y cancelación.
- Probar validaciones: modalidad personalizada, rango de edad, fecha/hora futura, precio y campos obligatorios.
- Revisar perfil, editar perfil, cambio de foto y logout/login.
- Probar móvil: pantalla chica, teclado, scroll de formularios, safe areas y cache limpia.
- La QA automatizada no sustituye pruebas reales con dos cuentas ni pruebas de RLS en Supabase.

## Roadmap (orden de trabajo)

1. **Jugadores y amigos:** búsqueda por usuario/ID, perfiles públicos, solicitudes, bloquear y reportar.
2. **Historial y asistencia:** validar partido jugado, registrar asistencia, estadísticas reales y revisión de faltas.
3. **Notificaciones:** recordatorios, cambios de cupo, promoción de lista de espera y actividad de amigos.
4. **Comunidad y Academia:** publicaciones de fútbol callejero y contenidos de técnica.
5. **Equipos y progreso:** equipos, temporadas, logros, recompensas y cosméticos.
6. **Privados e invitaciones:** cuando la base de acceso y las invitaciones estén listas.

## Pendientes conocidos

- **Avatar rings:** pausar los cambios de diseño/recorte; verificar el resultado visual en un dispositivo antes de continuar.
- **Calle/comunidad:** vista placeholder para una futura etapa.
- **Privados/invitaciones:** todavía no habilitados.
- **Cosméticos animados:** postergados; primero terminar bien los frames estáticos.

