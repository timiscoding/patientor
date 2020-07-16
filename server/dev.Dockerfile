FROM ubuntu

RUN apt-get update && apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_12.x | bash && \
    apt-get install -y nodejs && \
    apt-get purge -y --autoremove curl

WORKDIR /app
COPY . .

EXPOSE 3001
