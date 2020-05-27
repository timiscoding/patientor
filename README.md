# Patientor

An electronic health record system that lets healthcare providers add patients and consultation entries.

## Demo

It's hosted on a heroku free tier dyno so please be patient on first page load.

[Check it out](https://patientor.now.sh/)

## About

This project was completed with the main objective of learning TypeScript in
[part 9](https://fullstackopen.com/en/part9) of the [Full stack open course](https://fullstackopen.com/en/about).

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

## Frontend

* React in TS
* Semantic UI
* Formik forms (validation with Yup)

For this part, a [sample project](https://github.com/fullstack-hy2020/patientor) was supplied as a
starting point with a basic patient list being rendered with nothing hooked up to the back end. I spent
quite a bit of time getting the form to render the common data fields while being able to change the record
type (hospital/check up/occupational healthcare) dynamically. I wanted the ability to switch between
editing the form and looking up health entries without losing what was already entered into the form.

### Build

Stock standard Create React App with TS template
```
npm install
npm start
```
