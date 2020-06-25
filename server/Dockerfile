FROM ubuntu

WORKDIR /patientor-server
RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash
RUN apt-get install -y nodejs
COPY . .
RUN npm install
EXPOSE 3001
CMD ["npm", "run", "dev"]
