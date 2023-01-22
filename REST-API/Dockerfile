FROM node:19-alpine

RUN apk update && apk add --no-cache curl~=7.87.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]