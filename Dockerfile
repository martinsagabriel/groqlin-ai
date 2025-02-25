# Estágio de construção
FROM node:18-alpine

WORKDIR /app

# Copia arquivos
COPY src /app/src
COPY package.json /app
COPY public /app/public

# Instala dependências
RUN npm install

# Porta exposta
EXPOSE 3380

# Variáveis de ambiente
ENV REACT_APP_GROQ_API_KEY=string

# Comando para iniciar o Nginx
CMD ["npm", "start"]