# image size comparison
# ubuntu  351MB
# alpine  88.5MB

FROM node:10-alpine AS build-stage

WORKDIR /build
COPY . .
RUN npm i && npm run build

FROM node:10-alpine

ENV REDIS_HOST=$REDIS_HOST \
    REDIS_PORT=$REDIS_PORT \
    REDIS_PASSWORD=$REDIS_PASSWORD

WORKDIR /app
COPY --from=build-stage /build/dist .
RUN chown -R node .

USER node

EXPOSE 3001
CMD ["node", "bundle.js"]
