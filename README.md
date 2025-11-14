# Task App

## Descripción
Aplicación web para gestión de tareas con autenticación de usuarios, desarrollada con React y Node.js.

## Instalación
```bash
# Clonar repositorio
git clone <url-repositorio>
cd task-app

# Instalar backend
cd server
npm install

# Instalar frontend  
cd client
npm install
```

Backend (/server/.env)
```bash
#env
DB_NAME=tp_integrador
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_DIALECT=mysql
DB_PORT=3307
JWT_SECRET=jwt_secret
PORT=3000
```

Ejecución

```bash
# Backend (puerto 3000)
cd server
npm run dev

# Frontend (puerto 5173)  
cd client
npm run dev
```