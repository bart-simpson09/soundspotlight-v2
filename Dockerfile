FROM node:21-alpine AS install
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm i

FROM node:21-alpine AS build
WORKDIR /usr/src/app

COPY --from=install /usr/src/app/node_modules ./node_modules

COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npm run build

CMD [ "npm", "start" ]

EXPOSE 80