FROM node:14-alpine

RUN apk add --no-cache git

WORKDIR /app

COPY package*.json ./
RUN npm i

COPY . .

ENTRYPOINT [ "node", "index.js" ]
CMD [ "cron" ]