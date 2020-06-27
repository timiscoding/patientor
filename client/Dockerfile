FROM ubuntu
ARG apiurl
WORKDIR /patientor-client
RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash
RUN apt-get install -y nodejs
COPY . .
