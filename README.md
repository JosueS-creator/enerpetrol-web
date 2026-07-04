# Enerpetrol Web

Sitio web público (landing) + panel de administración conectado a la misma base
de datos Supabase que usa la app móvil `enerpetrol-app`.

## Qué incluye

- **Landing page** (`/`): promociona la app, explica el sistema de puntos y
  muestra la red de 35 estaciones en 13 ciudades.
- **Panel admin** (`/admin`): requiere iniciar sesión con una cuenta que tenga
  `rol = 'admin'` en la tabla `perfiles`. Incluye:
  - **Resumen**: estadísticas generales en tiempo real.
  - **Estaciones**: crear, editar, desactivar y eliminar estaciones (esto NO
    existía antes ni siquiera en el panel móvil — se agregaron las políticas
    de seguridad necesarias en Supabase para habilitarlo).
  - **Usuarios**: editar nombre, ciudad, rol y galones acumulados de cualquier
    cuenta.
  - **Facturas**: aprobar (con monto de galones editable), rechazar o eliminar
    facturas, con filtros por estado.
  - **Reportes**: gráficas de galones por ciudad y estado de facturas, más
    exportación a Excel con hojas "Resumen" y "Detalle" por rango de fechas.

## Cambios aplicados en Supabase

Se agregaron estas políticas RLS nuevas (ya aplicadas, no necesitas hacer nada):
- `admin_inserta_estaciones`, `admin_actualiza_estaciones`, `admin_elimina_estaciones`
- `admin_elimina_facturas`

Antes de esto, ningún panel (ni móvil ni web) podía crear o editar estaciones.

## 1. Configurar variables de entorno

Copia `.env.example` a `.env` y coloca tu **anon key** de Supabase (Project
Settings → API → anon public):

```
VITE_SUPABASE_URL=https://toyqwvyzdjvfomfomwdl.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

## 2. Probar localmente (opcional)

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

## 3. Subir a un repositorio de GitHub nuevo

Recomendado: un repo **separado** del de la app móvil (ej. `enerpetrol-web`),
para no arriesgar el funcionamiento del PWA que ya está en producción.

1. Ve a github.com → "New repository" → nómbralo `enerpetrol-web` → Create.
2. En tu computadora, dentro de esta carpeta:
   ```bash
   git init
   git add .
   git commit -m "Sitio web y panel admin de Enerpetrol"
   git branch -M main
   git remote add origin https://github.com/JosueS-creator/enerpetrol-web.git
   git push -u origin main
   ```

## 4. Desplegar en Vercel

1. Ve a vercel.com → "Add New Project" → importa `enerpetrol-web`.
2. Framework Preset: Vite (se detecta automático).
3. En "Environment Variables" agrega las mismas dos variables del paso 1
   (`VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`).
4. Deploy.

Como usa el mismo proyecto de Supabase, cualquier cambio hecho desde el panel
web (aprobar facturas, editar estaciones, etc.) se refleja de inmediato en la
app móvil, y viceversa.

## 5. Crear tu primera cuenta admin para el sitio web

Cualquier usuario cuya fila en `perfiles` tenga `rol = 'admin'` puede entrar a
`/admin`. Si ya tienes una cuenta admin en la app móvil, usa el mismo correo y
contraseña para entrar al panel web — es la misma base de usuarios.

## Notas

- El botón "Descargar app" / "Abrir la app Enerpetrol" del landing apunta a:
  `https://enerpetrol-app-git-main-enerpetrol.vercel.app`. Actualiza esa URL
  en `src/pages/Landing.jsx` si tu dominio de producción cambia.
- El panel admin web tiene permisos más amplios que el móvil (gestión completa
  de estaciones y eliminación de facturas). Ambos comparten la misma
  autenticación y base de datos.
