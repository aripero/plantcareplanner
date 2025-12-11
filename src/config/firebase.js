import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// 🔥 CONFIGURACIÓN DE FIREBASE
// 
// Para obtener estos valores:
// 1. Ve a https://console.firebase.google.com/
// 2. Selecciona tu proyecto
// 3. Haz clic en el ícono ⚙️ (engranaje) → "Project settings"
// 4. Desplázate hacia abajo hasta "Your apps"
// 5. Si no tienes una app web, haz clic en el ícono </> (Web) para crear una
// 6. Copia los valores del objeto firebaseConfig que aparece
// 7. Pega los valores aquí abajo, reemplazando los "YOUR_..."
//
// Ver CONFIGURAR_FIREBASE.md para instrucciones detalladas con imágenes

const firebaseConfig = {
    apiKey: "AIzaSyBSgrz8aeexRDHcGUWy2u9Z9mLUcsXT0k8",
    authDomain: "plantcareplanner.firebaseapp.com",
    projectId: "plantcareplanner",
    storageBucket: "plantcareplanner.firebasestorage.app",
    messagingSenderId: "1000244517892",
    appId: "1:1000244517892:web:f400e8dddfddd72d44e951"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Enable Google sign-in for all users
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;

