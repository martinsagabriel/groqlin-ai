# Estágio de construção
FROM node:20-alpine AS builder

WORKDIR /app

# Copia arquivos
COPY . .

# Instala dependências
RUN npm install

# Porta exposta
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["npm", "start"]