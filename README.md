# Patientor

An electronic health record system that lets healthcare providers add patients and consultation entries.

## Demo

It's hosted on a heroku free tier dyno so please be patient on first page load.

[Check it out](https://patientor.now.sh/)

## About

This project was completed with the main objective of learning TypeScript in
[part 9](https://fullstackopen.com/en/part9) of the [Full stack open course](https://fullstackopen.com/en/about).

## Docker dev build (easiest method)

Redis db is stored in a bind mount so a dir called `redis` must exist in project root. See `docker-compose.yml`
Client uses port 3000 and server port 3001. Client also uses create-react-app and the log output clears the
screen before showing output which can get annoying if you want to see the server logs.

You can start all services with:

```
docker-compose up
```

but it might be better to start the server in one terminal:

```
docker-compose up patientor-backend
```

and the client in another:

```
docker-compose up patientor-frontend
```

Bind mounts have been setup for the client and server `/src` dirs so that any code changes will be reflected in
the browser. However, any npm package changes will require rebuilding the container images.

```
docker-compose up --build
```

## Backend

* node/express in TS
* ioredis client

Data persistance was outside the scope of the project but I wanted the data stored somewhere when deployed.
The patients and entries are stored in a list data type enabling the use of capped lists so that no
more than 100 patients/entries are shown at a time.

* `/api/diagnoses` - list of diagnosis codes used to treat patients
* `/api/patients` - patient data
* `/api/patient/:id/entries` - list of entries by the healthcare provider recording the patients
consultation including description, type of visit (hospital/check up/occupational healthcare), diagnosis, specialist, etc

All data is server side validated for type and max lengths.

### Dev build

Install deps
```
npm install
```
Using Redistogo as a redis host since they offer a free tier. The latest version they support is 3.2
so make sure to install that version.
After it's installed, run it
```
redis-server
```
Run the backend
```
npm run dev
```

Server listens on port 3001 by default or can be configured via PORT env var.

### Prod build
Compile TS
```
npm run build
```
which will output the generated JS into `server/build`. The server needs certain environment vars set up
in order to connect to Redis. See `.env.sample`

## Frontend

* React in TS
* Semantic UI
* Formik forms (validation with Yup)

For this part, a [sample project](https://github.com/fullstack-hy2020/patientor) was supplied as a
starting point with a basic patient list being rendered with nothing hooked up to the back end. I spent
quite a bit of time getting the form to render the common data fields while being able to change the record
type (hospital/check up/occupational healthcare) dynamically. I wanted the ability to switch between
editing the form and looking up health entries without losing what was already entered into the form.

### Dev build

Stock standard Create React App with TS template

For dev builds, the app uses a [proxy to handle API requests](https://create-react-app.dev/docs/proxying-api-requests-in-development).
Update the proxy field in `package.json` to where ever the server is running, which will typically be `localhost:3001`.
For testing on mobile, you can update it to a local ip instead. You need to restart the CRA dev server for the changes to take effect.

```
npm install
npm start
```

### Prod build

```
npm run build
```
An env var has to be setup during the build step so that the correct backend url is injected into the code.
Set `REACT_APP_API_URL=<BACKEND_HOST>` in whatever static web app PaaS is being used.
