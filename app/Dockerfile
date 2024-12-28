FROM node:14 AS build-stage
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .

ARG VUE_APP_API_URL
ENV VUE_APP_API_URL=$VUE_APP_API_URL

RUN npm run build

FROM node:14 AS production-stage

RUN npm install -g http-server

WORKDIR /usr/src/app

COPY --from=build-stage /usr/src/app/dist .

EXPOSE 8080
CMD ["http-server", "-p", "8080", "-P", "http://localhost:8080?"]