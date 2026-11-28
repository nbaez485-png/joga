# JOGA — Desarrollo

## Estado
- Rama de trabajo: `feature/module-2-matches`
- Producción/main: no modificados.
- Módulo 1 (cuentas/perfiles): existente, preservado.
- Módulo 2 (partidos): base de datos creada y frontend inicial en desarrollo.

## Base de datos (proyecto Supabase JOGA)
- Tablas: `matches`, `match_participants`, `match_private_location`.
- RPC: `create_match`, `join_match`, `leave_match`, `cancel_match`.
- Restricciones de edad opcionales `min_age` / `max_age`, aplicadas en servidor al anotarse.
- Organizador cuenta como participante/cupo.
- Lista de espera con promoción cuando alguien se retira.
- Dirección exacta guardada por separado y con política de lectura limitada.
- RLS habilitada; lectura de partidas/participantes/localización según las políticas existentes.
- Todos los cambios de esquema previos fueron aplicados en el proyecto JOGA.

## Frontend M2 agregado
- Pantalla Jugar: buscar y Mis partidos.
- Filtros por zona y modalidad.
- Listado de partidos futuros; contempla abiertos y llenos.
- Crear partido: título, modalidad, fecha/hora, zona, lugar, capacidad, precio, edad, nivel, descripción, privacidad, espera y dirección privada.
- Detalle de partido: información, límites de edad y dirección visible solo a organizador/participante.
- Acciones: anotarse, salir, cancelar como organizador.
- Mensajes para errores frecuentes.
- Mis partidos incluye organizados y anotados.
- Ajustes para fechas locales de Argentina y conteo de cupos sin incluir lista de espera.

## Verificación realizada
- Sintaxis JavaScript validada mediante compilación en runtime.
- IDs estáticos del frontend revisados; los dos IDs faltantes (`wav`, `detail-action`) se crean dinámicamente.
- Revisión de columnas, funciones RPC y políticas RLS.
- **Pendiente:** prueba real en navegador con cuenta autenticada, pruebas de RPC (crear, unirse, edad, lista de espera, salir, promoción, cancelación), revisión responsive, privacidad, errores de UI y accesibilidad.

## Pendientes / riesgos conocidos
- Invitaciones a partidos privados todavía no implementadas: la opción privado existe pero el flujo de invitación falta.
- Se detectó una versión antigua adicional de `create_match` sin parámetros de edad; revisar y limpiar la sobrecarga en Supabase antes de cerrar M2.
- No se ha auditado completamente la seguridad ni ejecutado advisors para M2.
- No se hizo merge a main ni deploy público.

## Próximo paso
Completar test funcional y revisión de seguridad del M2 en la rama de desarrollo antes de merge/deploy.
