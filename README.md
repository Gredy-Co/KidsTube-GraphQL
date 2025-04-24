# KidsTube-GraphQL

KidsTube es una API GraphQL diseñada para gestionar perfiles, videos y listas de reproducción para una plataforma orientada a niños. Proporciona endpoints seguros para interactuar con los datos de usuarios autenticados y permite operaciones CRUD sobre perfiles, videos y playlists.

## 📚 Tabla de Contenidos
- 📖 Descripción
- 🚀 Características Principales
- 🛠️ Tecnologías Utilizadas
- 📋 Requisitos Previos
- ⚙️ Instalación y Configuración
- ▶️ Ejecución
- 📡 Endpoints GraphQL
- 🔐 Autenticación
- 📝 Licencia

## 📖 Descripción
La API KidsTube proporciona una interfaz GraphQL para gestionar contenido multimedia y perfiles de usuario en una plataforma segura y amigable para niños. Incluye funcionalidades como la creación, consulta y gestión de videos, listas de reproducción y perfiles asociados a usuarios autenticados.

## 🚀 Características Principales
- 🔐 Autenticación JWT: Protege las rutas GraphQL utilizando tokens JWT.
- 👤 Gestión de Perfiles: Crea, consulta y administra perfiles de usuario.
- 🎥 Gestión de Videos: Consulta videos creados por un usuario específico.
- 📂 Gestión de Playlists: Crea y consulta listas de reproducción asociadas a perfiles o usuarios.
- 🔄 Relaciones entre Modelos: Los modelos están interconectados (perfiles, videos y playlists).
- 🛡️ Seguridad: Uso de middleware para validar tokens y proteger las rutas.

## 🛠️ Tecnologías Utilizadas
- Node.js: Entorno de ejecución para el backend.
- Express: Framework web para manejar solicitudes HTTP.
- GraphQL: Lenguaje de consulta para APIs.
- Mongoose: ODM para MongoDB.
- JWT: Autenticación basada en tokens.
- MongoDB: Base de datos NoSQL para almacenar datos.
- Cors: Middleware para habilitar CORS en el servidor.

## 📋 Requisitos Previos
Antes de ejecutar el proyecto, asegúrate de tener instalado lo siguiente:
- Node.js (versión 18.x o superior)
- MongoDB (base de datos local o conexión remota)
- npm (gestor de paquetes de Node.js)

## ⚙️ Instalación y Configuración
Clona este repositorio:
```bash
git clone https://github.com/tu-usuario/kidstube-graphql.git
cd kidstube-graphql
npm install
```

Crea un archivo `.env` en la raíz del proyecto y configura las siguientes variables de entorno:
```env
DATABASE_URL=mongodb://localhost:27017/kidstube
JWT_SECRET=your_secret_key
PORT=4000
```

- `DATABASE_URL`: URL de conexión a tu base de datos MongoDB.
- `JWT_SECRET`: Clave secreta para firmar los tokens JWT.
- `PORT`: Puerto en el que se ejecutará el servidor.

Asegúrate de que MongoDB esté en ejecución. Si usas Docker, puedes iniciar MongoDB con el siguiente comando:
```bash
docker run -d --name mongodb -p 27017:27017 mongo
```

## ▶️ Ejecución
Inicia el servidor en modo desarrollo:
```bash
npm run dev
```

Para ejecutar el servidor en producción:
```bash
npm start
```

El servidor estará disponible en [http://localhost:4000/graphql](http://localhost:4000/graphql).

## 📡 Endpoints GraphQL

### Obtener perfiles de un usuario
```graphql
query GetProfiles($userId: ID!) {
  profiles(userId: $userId) {
    id
    fullName
    avatar
  }
}
```

### Obtener playlists de un usuario
```graphql
query GetPlaylistsByUser($userId: ID!) {
  playlistsByUser(userId: $userId) {
    id
    name
    associatedProfiles {
      id
      fullName
    }
    videos {
      id
      title
    }
  }
}
```

### Obtener videos de un usuario
```graphql
query GetVideosByUser($userId: ID!) {
  videosByUser(userId: $userId) {
    id
    title
    description
    url
  }
}
```

### Obtener playlists de un perfil
```graphql
query GetPlaylistsByProfile($profileId: ID!) {
  playlistsByProfile(profileId: $profileId) {
    id
    name
    videos {
      id
      title
    }
  }
}
```

## 🔐 Autenticación
La API utiliza tokens JWT para autenticar las solicitudes. Para acceder a los endpoints GraphQL, debes incluir un token válido en el encabezado Authorization:

```http
Authorization: Bearer <token>
```

El middleware `authMiddleware` verifica el token y lo decodifica para obtener el usuario autenticado. Si el token es válido, se permite el acceso a los resolvers protegidos.

## 📝 Licencia
Este proyecto está bajo la licencia ISC. Puedes usar, modificar y distribuir este software de acuerdo con los términos de la licencia.


Licencia
Este proyecto está bajo la licencia ISC . Puedes usar, modificar y distribuir este software de acuerdo con los términos de la licencia.
