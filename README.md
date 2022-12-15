# Raven Nest
A small sample of [NestJS](https://docs.nestjs.com/) which saves data in [RavenDB](https://ravendb.net/) running in [Docker](https://www.docker.com/)

This project is a base for the tutorials on my [blog](https://afivan.com/category/development/ravennest/).

## Description
The application runs two simple endpoints: one to retrieve data and the other to create entities. There is no specific format it expects, basically when you create an entity all the body you send as JSON will be taken and saved in the database.

## How to run

Prerequisites: besides NodeJS you'll need Yarn to restore the packages in the app/ directory. The database is not authenticated and can be run very easily if you have Docker installed. If you already have a RavenDB instance running on your local machine with no auth, that's superb you just need to create a 'raven-nest' database. In case you have an already authenticated RavenDB instance, you need to configure the app to use the server certificate. You can check the instruction provided in the [package](https://npmjs.com/package/ravendb).

General steps to follow:

1. Run `yarn` inside the app folder
1. Go to *infrastructure/dev* folder and run docker-compose up
1. If the containers start fine, then go to [localhost:8080](http://localhost:8080). Here accept the EULA and then create a database called raven-nest
1. Now you are ready to start the app, so run the `yarn start:dev` command. The app should run in [localhost:3000](http://localhost:3000)

# Endpoints to play with

The application exposes two endpoints:

1. GET http://localhost:3000/app/entities - use this to retrieve the created entities. Returns empty in the beginning, no seed data is defined
1. POST http://localhost:3000/app/entities - use this to create entities. The data itself is read from the body of the request. No validation is performed

# Next steps

This is a very trivial app with the bare minimum that helps you start your project with RavenDB. It can be adapted to run with Mongo or SQL Databases, it can handle more complex scenarios like mapping DTOs, validation, security and so forth. It can be extended to sustain your production needs.

Any contributions are welcome! Licence is free as a bird! :)
