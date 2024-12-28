FROM node:latest
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .

COPY wait-for-it.sh .
COPY --from=parent .env ./

RUN npm run build

EXPOSE 8081
CMD ["./wait-for-it.sh", "db:3306", "--", "npm", "start"]
