FROM ubuntu

ENV REDIS_HOST=$REDIS_HOST \
    REDIS_PORT=$REDIS_PORT \
    REDIS_PASSWORD=$REDIS_PASSWORD

RUN apt-get update && apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_12.x | bash && \
    apt-get install -y nodejs && \
    apt-get purge -y --autoremove curl

WORKDIR /app
COPY . .
RUN npm run build

EXPOSE 3001
CMD ["npm", "start"]
