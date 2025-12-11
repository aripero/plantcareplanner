# 🔧 Solucionar Problemas de Deployment en GitHub Pages

Si el deployment falla, sigue estos pasos para solucionarlo.

## ✅ Paso 1: Verificar Configuración de GitHub Pages

1. Ve a tu repositorio: https://github.com/aripero/plantcareplanner
2. Haz clic en **Settings** (Configuración)
3. En el menú lateral, haz clic en **Pages**
4. Verifica que:
   - **Source** esté configurado como **"GitHub Actions"** (no "Deploy from a branch")
   - Si no está configurado así, cámbialo a **"GitHub Actions"**

## ✅ Paso 2: Verificar el Workflow Fallido

1. Ve a la pestaña **Actions** en tu repositorio
2. Haz clic en el workflow que falló (el que tiene la X roja)
3. Revisa los logs para ver el error específico

### Errores Comunes:

#### Error: "Permission denied" o "403"
- **Solución**: Verifica que GitHub Pages esté habilitado en Settings > Pages
- Asegúrate de que el repositorio sea público (si usas plan gratuito)

#### Error: "Environment not found"
- **Solución**: El workflow ya está actualizado con el environment correcto
- Espera a que se ejecute el nuevo workflow

#### Error: "Build failed"
- **Solución**: Revisa los logs del paso "Build" para ver errores específicos
- Verifica que `package.json` tenga todas las dependencias necesarias

## ✅ Paso 3: Verificar que el Build Funciona Localmente

Ejecuta estos comandos en tu terminal:

```bash
cd /Users/ariel/Development/PlantCarePlanner
npm install
npm run build
```

Si el build funciona localmente pero falla en GitHub Actions, puede ser un problema de:
- Versión de Node.js (el workflow usa Node 18)
- Dependencias faltantes en `package.json`

## ✅ Paso 4: Verificar el Workflow Actualizado

El workflow ahora incluye:
- ✅ Environment `github-pages` configurado
- ✅ Permisos correctos (`pages: write`, `id-token: write`)
- ✅ Acciones oficiales de GitHub Pages

## ✅ Paso 5: Esperar el Nuevo Deployment

Después de hacer push, el workflow se ejecutará automáticamente. Puedes:
1. Ir a **Actions** para ver el progreso
2. Esperar 1-2 minutos para que complete
3. Verificar que el workflow tenga un ✅ verde

## 🆘 Si Sigue Fallando

### Opción A: Verificar Logs Detallados

1. Ve a **Actions** > Click en el workflow fallido
2. Expande cada paso para ver los logs detallados
3. Busca líneas que digan "Error" o "Failed"

### Opción B: Verificar Configuración del Repositorio

1. **Settings** > **Pages**
   - Source: **GitHub Actions** ✅
   - Si dice "None" o "Deploy from a branch", cámbialo a "GitHub Actions"

2. **Settings** > **Actions** > **General**
   - Verifica que "Actions permissions" esté habilitado
   - "Workflow permissions" debería estar en "Read and write permissions"

### Opción C: Re-ejecutar el Workflow

1. Ve a **Actions**
2. Haz clic en el workflow fallido
3. Haz clic en **"Re-run jobs"** o **"Re-run all jobs"**

## 📝 Checklist de Verificación

- [ ] GitHub Pages está configurado como "GitHub Actions" en Settings > Pages
- [ ] El repositorio es público (si usas plan gratuito)
- [ ] El workflow tiene permisos correctos
- [ ] El build funciona localmente (`npm run build`)
- [ ] El base path en `vite.config.js` es `/plantcareplanner/`
- [ ] Firebase está configurado correctamente
- [ ] El dominio `aripero.github.io` está autorizado en Firebase

## 🎯 Próximos Pasos

Una vez que el workflow tenga éxito (✅ verde):

1. Espera 1-2 minutos para que GitHub Pages actualice
2. Visita: https://aripero.github.io/plantcareplanner/
3. Deberías ver la página de login de PlantCarePlanner

## 📞 Información Útil para Debugging

Si necesitas ayuda adicional, comparte:
- El mensaje de error completo del workflow
- Una captura de pantalla de Settings > Pages
- El output de `npm run build` local

