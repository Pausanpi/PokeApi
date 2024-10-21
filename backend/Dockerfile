# Usa una imagen oficial de Node.js como base
FROM node:18

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias del backend
RUN npm install

# Copia el resto de los archivos del backend al contenedor
COPY . .

# Expone el puerto que utilizará el backend (4001)
EXPOSE 4001

# Comando para iniciar el servidor
CMD ["npm", "start"]
