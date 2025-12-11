# 🔐 Cómo Autorizar el Dominio de GitHub Pages en Firebase

Si tu aplicación está desplegada en GitHub Pages pero no funciona (página en blanco o errores de autenticación), necesitas autorizar el dominio en Firebase.

## 📍 Paso 1: Ir a Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto **plantcareplanner**

## 📍 Paso 2: Ir a Authentication Settings

1. En el menú lateral izquierdo, haz clic en **"Authentication"**
2. Haz clic en la pestaña **"Settings"** (Configuración)
   - Está en la parte superior, junto a "Sign-in method" y "Users"

## 📍 Paso 3: Autorizar Dominios

1. Desplázate hacia abajo hasta la sección **"Authorized domains"** (Dominios autorizados)
2. Verás una lista de dominios autorizados, que normalmente incluye:
   - `localhost` (ya autorizado automáticamente)
   - `tu-proyecto.firebaseapp.com` (ya autorizado automáticamente)
   - `tu-proyecto.web.app` (ya autorizado automáticamente)

3. Haz clic en el botón **"Add domain"** (Agregar dominio)

4. En el cuadro de diálogo que aparece, ingresa:
   ```
   aripero.github.io
   ```
   **Importante:** Solo el dominio base, sin el path `/plantcareplanner/`

5. Haz clic en **"Add"** (Agregar)

## 📍 Paso 4: Verificar

Después de agregar el dominio, deberías ver:
- ✅ `aripero.github.io` en la lista de dominios autorizados

## ✅ Listo

Ahora tu aplicación debería funcionar correctamente en GitHub Pages.

## 🔍 Ubicación Visual

```
Firebase Console
│
├── Authentication
│   ├── Sign-in method (pestaña)
│   ├── Users (pestaña)
│   └── Settings (pestaña) ← AQUÍ
│       │
│       └── Scroll down ↓
│           └── Authorized domains ← AQUÍ
│               ├── localhost ✅
│               ├── plantcareplanner.firebaseapp.com ✅
│               └── [Add domain] ← HACER CLIC AQUÍ
│                   └── Ingresar: aripero.github.io
```

## 🆘 Problemas Comunes

### "No veo la pestaña Settings"
- Asegúrate de estar en **Authentication**, no en otra sección
- La pestaña "Settings" está en la parte superior junto a "Sign-in method"

### "El dominio ya existe"
- Si ya agregaste el dominio antes, no necesitas hacerlo de nuevo
- Verifica que esté en la lista de dominios autorizados

### "Sigue sin funcionar"
- Verifica que el base path en `vite.config.js` sea `/plantcareplanner/` (minúsculas)
- Espera unos minutos para que los cambios se propaguen
- Limpia la caché del navegador (Ctrl+Shift+R o Cmd+Shift+R)
- Verifica la consola del navegador (F12) para ver errores específicos

## 📝 Nota Importante

Firebase solo necesita el dominio base (`aripero.github.io`), no el path completo. Esto autorizará todos los subdirectorios bajo ese dominio.

