# 🔥 Cómo Configurar Firebase - Guía Paso a Paso

## 📍 Paso 1: Ir a Firebase Console

1. Abre tu navegador y ve a: **https://console.firebase.google.com/**
2. Inicia sesión con tu cuenta de Google
3. Selecciona tu proyecto (o créalo si aún no lo tienes)

## 📍 Paso 2: Encontrar la Configuración

### Opción A: Desde el Menú Principal

1. En la página principal de tu proyecto, busca el **ícono de engranaje (⚙️)** en la parte superior izquierda
2. Está junto a "Project Overview" o "Vista general del proyecto"
3. Haz clic en él y selecciona **"Project settings"** o **"Configuración del proyecto"**

### Opción B: Desde el Menú Lateral

1. En el menú lateral izquierdo, busca **"Project settings"** o **"Configuración"**
2. Haz clic en él

## 📍 Paso 3: Crear una App Web (si no la tienes)

1. En la página de configuración, desplázate hacia abajo
2. Busca la sección **"Your apps"** o **"Tus apps"**
3. Si no ves ninguna app web, verás varios íconos:
   - 📱 iOS
   - 🤖 Android  
   - `</>` **Web** ← **Este es el que necesitas**
4. Haz clic en el ícono **`</>`** (Web)
5. Aparecerá un formulario:
   - **App nickname**: Ponle un nombre (ej: "PlantCarePlanner")
   - **Firebase Hosting**: Puedes dejarlo sin marcar (no es necesario)
6. Haz clic en **"Register app"** o **"Registrar app"**

## 📍 Paso 4: Copiar la Configuración

Después de crear la app web, verás un código que se ve así:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "tu-proyecto-12345.firebaseapp.com",
  projectId: "tu-proyecto-12345",
  storageBucket: "tu-proyecto-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};
```

**¡Copia estos valores!** Necesitarás cada uno de ellos.

## 📍 Paso 5: Actualizar el Archivo en tu Proyecto

1. Abre el archivo: `src/config/firebase.js`
2. Reemplaza los valores `YOUR_...` con los valores que copiaste

### Ejemplo:

**ANTES:**
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

**DESPUÉS (con tus valores reales):**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "mi-proyecto-abc123.firebaseapp.com",
  projectId: "mi-proyecto-abc123",
  storageBucket: "mi-proyecto-abc123.appspot.com",
  messagingSenderId: "987654321098",
  appId: "1:987654321098:web:1234567890abcdef"
};
```

## 📍 Paso 6: Habilitar Authentication (Google)

1. En Firebase Console, ve a **"Authentication"** en el menú lateral
2. Haz clic en **"Get started"** si es la primera vez
3. Ve a la pestaña **"Sign-in method"** o **"Métodos de acceso"**
4. Haz clic en **"Google"**
5. Activa el toggle para **habilitar Google**
6. Selecciona un **Support email** (tu email)
7. Haz clic en **"Save"** o **"Guardar"**

## 📍 Paso 7: Crear Firestore Database

1. En Firebase Console, ve a **"Firestore Database"** en el menú lateral
2. Haz clic en **"Create database"** o **"Crear base de datos"**
3. Selecciona **"Start in test mode"** (para desarrollo)
4. Elige una **ubicación** (elige la más cercana a ti)
5. Haz clic en **"Enable"** o **"Habilitar"**

## ✅ Verificación

Después de completar estos pasos:

1. Guarda el archivo `src/config/firebase.js`
2. Ejecuta `npm run dev` en tu terminal
3. Abre la aplicación en el navegador
4. Deberías poder hacer clic en "Sign in with Google" y autenticarte

## 🆘 Problemas Comunes

### "No veo la sección 'Your apps'"
- Asegúrate de estar en la pestaña **"General"** dentro de Project settings
- Desplázate hacia abajo, está al final de la página

### "No puedo crear una app web"
- Verifica que tengas permisos de administrador en el proyecto
- Intenta refrescar la página

### "Los valores no funcionan"
- Verifica que copiaste los valores exactamente (sin espacios extra)
- Asegúrate de que todos los valores estén entre comillas dobles
- Verifica que no haya caracteres faltantes

### "Error de autenticación"
- Verifica que hayas habilitado Google en Authentication
- Asegúrate de que el dominio esté autorizado (Firebase lo hace automáticamente para localhost)

## 📸 Ubicación Visual

```
Firebase Console
│
├── [Tu Proyecto]
│   │
│   ├── ⚙️ Project Overview
│   │   └── Project settings ← AQUÍ
│   │       │
│   │       ├── General (pestaña)
│   │       │   └── Scroll down ↓
│   │       │       └── Your apps ← AQUÍ
│   │       │           └── </> Web ← CREAR APP AQUÍ
│   │       │
│   │       └── Service accounts
│   │
│   ├── Authentication ← HABILITAR GOOGLE AQUÍ
│   │
│   └── Firestore Database ← CREAR BASE DE DATOS AQUÍ
```

## 🎯 Resumen Rápido

1. ⚙️ Project settings → General
2. Scroll down → Your apps
3. `</>` Crear app web
4. Copiar configuración
5. Pegar en `src/config/firebase.js`
6. Habilitar Google en Authentication
7. Crear Firestore Database

¡Listo! 🎉

