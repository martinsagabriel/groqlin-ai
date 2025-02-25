# Estágio de construção
FROM node:20-alpine AS build

WORKDIR /app

# Copia arquivos
COPY package*.json /app
COPY src /app/src
COPY public /app/public

# Instala dependências
RUN npm install

# Estágio de produção
RUN npm run build

# Etapa final: configuração do servidor Nginx para servir o build estático
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html

# Porta exposta
EXPOSE 3380

# Define a variável de ambiente a partir do argumento
ENV REACT_APP_GROQ_API_KEY=string

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]
