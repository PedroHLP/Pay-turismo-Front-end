# Etapa de construção
# Aqui usamos a imagem mais recente do Node.js disponível no Docker Hub.
# Esta imagem será usada para construir o projeto React.
FROM node:20.14.0 as build

# Define o diretório de trabalho dentro do contêiner.
# Este é o diretório onde todos os comandos serão executados.
WORKDIR /app

# Copia os arquivos de configuração do projeto (package.json e package-lock.json)
# para o diretório de trabalho atual no contêiner.
COPY package*.json ./

# Executa o comando npm install para instalar todas as dependências do projeto.
RUN npm install

# Copia o restante dos arquivos do projeto para o diretório de trabalho no contêiner.
COPY . .

# Executa o script de construção do projeto React.
# Este script cria uma versão otimizada do aplicativo para produção.
RUN npm run build

# Etapa de produção
# Aqui usamos uma imagem do Nginx para servir o aplicativo construído.
# Nginx é um servidor web que é eficiente e leve, ideal para servir conteúdo estático.
FROM nginx:stable-alpine

# Copia os arquivos construídos da etapa de construção para o diretório de
# hospedagem do Nginx dentro do contêiner.
# Aqui, mudamos /app/build para /app/dist que foi criada pelo npm run build
COPY --from=build /app/dist /usr/share/nginx/html

# Define a porta que o contêiner deve expor.
# Por padrão, o Nginx serve na porta 80.
EXPOSE 80

# Define o comando padrão para iniciar o servidor Nginx.
# Este comando inicia o Nginx e o mantém em execução.
CMD ["nginx", "-g", "daemon off;"]

