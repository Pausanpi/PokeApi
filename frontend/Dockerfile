# Usa una imagen de Node.js como base
FROM node:18 AS build

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

# Construye la aplicación para producción
RUN npm run build

# Usa Nginx para servir la aplicación
FROM nginx:alpine

# Copia la compilación de React al contenedor de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Exponer el puerto que utilizará el frontend (3000)
EXPOSE 3001

# Inicia Nginx
CMD ["nginx", "-g", "daemon off;"]
