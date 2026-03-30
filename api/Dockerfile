FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run db:generate
RUN apt-get update && apt-get install -y netcat-openbsd

EXPOSE 3030

CMD ["sh", "./docker-entrypoint.sh"]