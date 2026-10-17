# Products Manager

Aplicación móvil para administrar un catálogo de productos, construida con React Native, Expo y TypeScript. Permite iniciar sesión, consultar productos, crearlos, editarlos y eliminarlos, además de agregar fotografías desde la cámara o la galería.

El frontend consume la API de [TesloShop Backend](https://github.com/Klerith/tesloshop-backend), desarrollada por Fernando Herrera. **Para utilizar la aplicación necesitas ejecutar tanto el backend como Expo.**

## Funcionalidades

- Inicio de sesión y almacenamiento del token en el dispositivo.
- Catálogo con paginación, precio y estado del inventario.
- Creación y edición de productos con descripción, precio, unidades, tallas y categoría.
- Captura y selección de fotografías; eliminación de fotos del producto al guardar.
- Botón de guardado que se habilita cuando existen cambios y los campos son válidos.
- Eliminación de productos con confirmación.
- Tema claro y oscuro según la configuración del dispositivo.

## Requisitos

- Git.
- Node.js **22.13 o superior dentro de la rama 22**, o **24.3 o superior dentro de la rama 24**, con npm.
- Docker Desktop o Docker Engine con Docker Compose para ejecutar el backend y PostgreSQL.
- Expo Go compatible con **Expo SDK 57** en un teléfono, o un entorno de simulación configurado.
- Para el simulador de iOS: macOS y Xcode. Para el emulador de Android: Android Studio y un dispositivo virtual iniciado.

El proyecto utiliza Expo SDK 57, React Native 0.86 y React 19.2. Consulta la [referencia de Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/) y la [configuración del entorno de Expo](https://docs.expo.dev/get-started/set-up-your-environment/) si necesitas preparar el dispositivo o simulador.

## 1. Preparar el backend

En una carpeta independiente del frontend:

```bash
git clone https://github.com/Klerith/tesloshop-backend.git
cd tesloshop-backend
cp .env.template .env
```

En Windows puedes copiar `.env.template` y renombrar la copia a `.env` desde el explorador de archivos.

Revisa el `.env` **del backend** antes de iniciar Docker:

- `PORT`: usa `3000` para seguir los ejemplos de este documento.
- `DB_NAME` y `DB_HOST`: conserva los valores compatibles de la plantilla; `DB_HOST` debe resolver al contenedor de PostgreSQL definido en `docker-compose.yml`.
- `DB_PASSWORD` y `JWT_SECRET`: configura valores propios para tu entorno local.
- `HOST_API`: dirección base del backend, incluyendo `/api`. Usa `http://localhost:3000/api` para pruebas desde la computadora o una IP de red accesible desde el teléfono.

Inicia los servicios:

```bash
docker compose up -d
```

Comprueba que estén en ejecución:

```bash
docker compose ps
```

La documentación interactiva de la API estará en [http://localhost:3000/api](http://localhost:3000/api). Si todavía no responde, revisa los registros:

```bash
docker compose logs -f app
```

### Cargar datos de demostración

Solo para la primera preparación de una base de datos local de pruebas:

```bash
curl http://localhost:3000/api/seed
```

**El seed elimina los productos y usuarios existentes y carga nuevamente los datos de demostración. No lo ejecutes sobre una base con información que quieras conservar.** No es necesario repetirlo cada vez que inicies la aplicación.

La imagen del backend utilizada por este proyecto incluye esta cuenta de demostración después de ejecutar el seed:

| Campo      | Valor              |
| ---------- | ------------------ |
| Correo     | `test1@google.com` |
| Contraseña | `Abc123`           |
| Rol        | `admin`            |

Utiliza la cuenta administradora para probar el flujo completo: el backend requiere ese rol para editar y eliminar productos. Estas credenciales pertenecen a los datos de ejemplo y son únicamente para desarrollo local.

## 2. Instalar el frontend

Abre otra terminal y clona este repositorio:

```bash
git clone https://github.com/AaronTorres10/products-app.git
cd products-app
npm ci
cp .env.template .env
```

`npm ci` instala las versiones registradas en `package-lock.json`. Si ya tienes el repositorio descargado, ejecuta los dos últimos comandos desde su carpeta; conserva tu `.env` si ya está configurado.

## 3. Configurar la conexión con la API

Edita el `.env` **del frontend**. Para un simulador de iOS o el emulador estándar de Android en la misma computadora que el backend:

```dotenv
EXPO_PUBLIC_STAGE=dev
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_API_URL_IOS=http://localhost:3000/api
EXPO_PUBLIC_API_URL_ANDROID=http://10.0.2.2:3000/api
```

Todas las direcciones deben incluir `/api` y conviene dejarlas sin `/` al final.

| Variable                      | Cuándo se utiliza                                                                                         |
| ----------------------------- | --------------------------------------------------------------------------------------------------------- |
| `EXPO_PUBLIC_STAGE`           | Con `prod`, la app usa `EXPO_PUBLIC_API_URL`. Con `dev`, elige la dirección según la plataforma.          |
| `EXPO_PUBLIC_API_URL`         | Dirección compartida cuando `EXPO_PUBLIC_STAGE=prod`.                                                     |
| `EXPO_PUBLIC_API_URL_IOS`     | Dirección para iOS cuando `EXPO_PUBLIC_STAGE=dev`.                                                        |
| `EXPO_PUBLIC_API_URL_ANDROID` | Dirección para Android cuando `EXPO_PUBLIC_STAGE=dev`. El código actual también usa esta variable en web. |

La selección se encuentra en `core/api/productsApi.ts`.

### Teléfono físico

La computadora y el teléfono deben estar en la misma red. Sustituye `localhost` por la **IP local de la computadora que ejecuta Docker**, tanto para iOS como para Android. Por ejemplo, si esa IP es `192.168.1.50`:

```dotenv
EXPO_PUBLIC_API_URL_IOS=http://192.168.1.50:3000/api
EXPO_PUBLIC_API_URL_ANDROID=http://192.168.1.50:3000/api
```

`192.168.1.50` es un ejemplo: debes reemplazarla por tu propia IP. Las direcciones `192.0.0.0` incluidas en `.env.template` también deben reemplazarse.

Desde un teléfono, `localhost` apunta al propio teléfono. La dirección `10.0.2.2` es para el emulador estándar de Android; para un dispositivo físico usa la IP de tu computadora.

Comprueba desde el navegador del teléfono que puedas abrir `http://TU_IP:3000/api`. Si cambias `HOST_API` en el backend, aplica su configuración desde la carpeta del backend con `docker compose up -d`.

Las variables `EXPO_PUBLIC_*` se incluyen en la aplicación: configura aquí direcciones públicas de conexión, nunca contraseñas de base de datos ni secretos JWT. Consulta la [documentación de variables de entorno de Expo](https://docs.expo.dev/guides/environment-variables/).

## 4. Ejecutar la aplicación

Desde la carpeta del frontend:

```bash
npm start
```

- **Teléfono:** abre el proyecto con Expo Go compatible con SDK 57 usando el QR de la terminal. En iOS puedes escanearlo con la cámara; en Android, desde Expo Go.
- **Simulador de iOS:** presiona `i` en la terminal de Expo.
- **Emulador de Android:** inicia el dispositivo virtual y presiona `a`.

También puedes usar `npm run ios` o `npm run android` para iniciar Expo y abrir la plataforma correspondiente. Estos comandos no compilan una aplicación nativa.

Si cambias las variables de conexión, reinicia Expo y recarga la app. Para limpiar la caché de Metro:

```bash
npx expo start --clear
```

Si Expo Go indica que el SDK no es compatible, utiliza un cliente compatible desde [Expo Go](https://expo.dev/go) o prepara una [compilación de desarrollo](https://docs.expo.dev/develop/development-builds/introduction/). No cambies las versiones de las dependencias al azar para evitar ese mensaje.

### Vista previa web

```bash
npm run web
```

Esta opción permite inspeccionar la interfaz, pero **el flujo completo está orientado a iOS y Android**. El almacenamiento de sesión actual utiliza `expo-secure-store` y no tiene un adaptador para navegador; no debe considerarse que la autenticación y las operaciones protegidas funcionan completamente en web.

## 5. Usar la aplicación

1. Inicia sesión con una cuenta existente del backend. Para una instalación local con el seed, utiliza la cuenta administradora indicada arriba.
2. Consulta el catálogo y toca una tarjeta para abrir el detalle.
3. Pulsa **Nuevo producto** para crear uno. Completa nombre, identificador o slug único, precio y unidades; agrega descripción, categoría, tallas y fotografías según corresponda.
4. Permite el acceso a cámara y galería cuando quieras utilizar esas funciones. Usa un teléfono para probar la captura de fotos.
5. Guarda el producto. En edición, **Guardar cambios** permanece deshabilitado mientras no haya modificaciones o los campos obligatorios sean inválidos.
6. Para quitar una foto, pulsa su **×** y guarda los cambios. Esto la retira del producto; no elimina el archivo de la galería del teléfono.
7. Para borrar un producto guardado, utiliza **Eliminar producto** al final del detalle y confirma la operación.

El registro de cuentas desde la aplicación todavía no está conectado. Para cuentas diferentes de las de demostración, utiliza el endpoint `POST /api/auth/register` documentado en Swagger o solicita una cuenta al administrador del backend. Registrar una cuenta no le concede automáticamente permisos de administrador.

## Verificación del proyecto

```bash
npm run lint
npx tsc --noEmit
```

Para diagnosticar problemas de dependencias o configuración de Expo:

```bash
npx expo-doctor
```

## Problemas frecuentes

| Problema                                              | Qué revisar                                                                                                                    |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| No inicia sesión o no carga el catálogo               | Backend encendido, URL con `/api`, dirección correcta para el dispositivo y credenciales válidas.                              |
| La computadora abre la API, pero el teléfono no       | IP local, misma red, publicación del puerto `3000` de Docker y acceso permitido por el firewall.                               |
| Una cuenta puede entrar, pero no editar o eliminar    | Esas operaciones requieren rol `admin` en el backend utilizado.                                                                |
| El catálogo está vacío después de instalar el backend | Comprueba si cargaste el seed en tu base local de pruebas. Revisa la advertencia antes de ejecutarlo.                          |
| No se refleja un cambio en `.env`                     | Reinicia Expo y recarga la aplicación.                                                                                         |
| Cámara o galería sin acceso                           | Revisa los permisos de la aplicación en los ajustes del teléfono.                                                              |
| El backend no arranca                                 | Ejecuta `docker compose logs -f app` desde su carpeta y revisa variables, disponibilidad de puertos y conexión con PostgreSQL. |

## Organización

```text
src/app/                    Pantallas y navegación con Expo Router
src/constants/              Colores, fuentes y constantes visuales
presentation/               Componentes, hooks y estado de la interfaz
core/                       API, acciones e interfaces de dominio
helpers/                    Adaptadores compartidos
assets/                     Imágenes y fuentes
```

El estado remoto utiliza TanStack Query; el estado de autenticación y cámara utiliza Zustand, y los formularios de producto utilizan Formik. El backend se mantiene en un repositorio independiente.
