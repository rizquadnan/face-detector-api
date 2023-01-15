# syntax=docker/dockerfile:1

FROM node:14.21.2
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]

RUN yarn install

COPY . .

CMD ["node", "server.js"]