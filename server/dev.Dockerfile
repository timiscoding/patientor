FROM node:10-alpine

WORKDIR /patientor-api
COPY . .

EXPOSE 3001
