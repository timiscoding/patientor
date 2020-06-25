FROM ubuntu
ARG apiurl
WORKDIR /patientor-client
RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash
RUN apt-get install -y nodejs
COPY . .
RUN npm install
ENV REACT_APP_API_URL=$apiurl
EXPOSE 3000
CMD ["npm", "start"]
