# Guía: Cómo Obtener la Configuración de Firebase

Esta guía te ayudará a obtener las credenciales de Firebase para configurar la aplicación.

## Paso 1: Acceder a la Configuración del Proyecto

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto (o créalo si aún no lo has hecho)
3. En la parte superior izquierda, haz clic en el **ícono de engranaje (⚙️)** junto a "Project Overview"
4. Selecciona **"Project settings"** o **"Configuración del proyecto"**

## Paso 2: Encontrar la Configuración de la Web App

1. En la página de configuración, desplázate hacia abajo hasta la sección **"Your apps"** o **"Tus apps"**
2. Si aún no has creado una app web, haz clic en el **ícono `</>`** (Web) para agregar una nueva app web
3. Si ya tienes una app web, haz clic en ella para ver su configuración

## Paso 3: Obtener las Credenciales

Una vez que tengas la app web seleccionada, verás algo como esto:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

## Paso 4: Copiar los Valores

Necesitas copiar estos 6 valores:
- **apiKey**: La clave API de Firebase
- **authDomain**: El dominio de autenticación (generalmente `tu-proyecto.firebaseapp.com`)
- **projectId**: El ID de tu proyecto
- **storageBucket**: El bucket de almacenamiento (generalmente `tu-proyecto.appspot.com`)
- **messagingSenderId**: El ID del remitente de mensajería
- **appId**: El ID de la aplicación

## Paso 5: Actualizar el Archivo de Configuración

Abre el archivo `src/config/firebase.js` en tu proyecto y reemplaza los valores `YOUR_...` con los valores que copiaste.

## Visual Guide (Guía Visual)

```
Firebase Console
├── Project Overview
│   └── ⚙️ Settings (Configuración)
│       └── Project settings (Configuración del proyecto)
│           └── Scroll down (Desplázate hacia abajo)
│               └── Your apps (Tus apps)
│                   └── </> Web App (App Web)
│                       └── Config object (Objeto de configuración)
```

## Nota Importante

Si no ves la sección "Your apps", es posible que necesites:
1. Crear una nueva app web haciendo clic en el ícono `</>`
2. Registrar la app con un nombre (por ejemplo: "PlantCarePlanner")
3. No es necesario habilitar Firebase Hosting para esta configuración

## Verificación

Después de actualizar `src/config/firebase.js`, deberías poder:
- Iniciar sesión con Google
- Ver y agregar plantas
- Ver el calendario

Si tienes problemas, verifica que:
- Todos los valores estén entre comillas
- No haya espacios extra
- Los valores coincidan exactamente con los de Firebase Console

