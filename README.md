# boom README

## Authorization

An authorization token needs to be located in the .env.local file for de dev environment to work.
The key names are:

- VITE_OBJECTS_API_KEY=<token>
- VITE_OBJECTTYPES_API_KEY=<token>

## Installation

To install the BOOM-app you need:
node.js
npm
docker

### Installing the BOOM-app dev environment

1. Clone this repository
2. run `npm install` from the boom-app folder
3. Create an `.env.local` file in the `boom-app/` folder and add the following:
   - VITE_OBJECTS_API_KEY=cd63e158f3aca276ef284e3033d020a22899c728
   - VITE_OBJECTTYPES_API_KEY=ba9d233e95e04c4a8a661a27daffe7c9bd019067
     These token values are corresponding with the preloaded demo tokens for the Objects-api demo
4. run `npm run dev`

### Install Objects-API demo environment

1. Create an objects-api folder
2. Clone the `docker-compose.yml` from https://github.com/maykinmedia/objects-api into the `objects-api` folder
3. Inside the objects-api folder, create the folder structure: `docker/setup_configuration`
4. Clone the two files from https://github.com/maykinmedia/objects-api/tree/master/docker/setup_configuration inside the `setup_configuration` folder
5. Run the following commands:
   - `docker compose up -d`
   - `docker compose exec web ./src/manage.py loaddata demodata`
   - `docker compose exec objecttypes-web ./src/manage.py loaddata demodata`
   - `docker compose exec web ./src/manage.py createsuperuser`
6. Go to http://localhost:8000/admin and login
7. Go to `Configuration -> services` and click on `Objecttypen API` to edit the entry.
   change the following fields to hold the supplied information:

   - api root url: http://objecttypes-web:8000/api/v2
   - Header value: Token ba9d233e95e04c4a8a661a27daffe7c9bd019067
