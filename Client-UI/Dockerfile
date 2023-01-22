FROM node:19-alpine

RUN apk update && apk add --no-cache curl~=7.87.0

WORKDIR /app

COPY package*.json ./

RUN npm i -g @angular/cli

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start"]