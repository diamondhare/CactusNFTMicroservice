FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache git

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 8545
