FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run db:generate

EXPOSE 3001

CMD ["npm", "run", "dev"]