# boom-app 

BOOM stands for Bulk Overige Objecten Mapping.
It is a tool that can be used to upload a CSV file with Overige Objecten data and map the columns to the corresponding Objecttype fields.

## Installation

To install the BOOM-app you need:
node.js
npm
docker

### Installing the BOOM-app dev environment

1. Clone the BOOM repository
2. run `npm install` from the boom-app folder
3. Create an `.env.local` file in the `boom-app/` folder and add the environment variables mentioned below.
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

## Environment variables

### Authorization

An authorization token and base url for the Objects(types) API needs to be located in user secretse of the boom.bff environment.
The key names are:

{
  "ObjectTypes": {
    "Base_URL": "<ObjectTypes base URL> (example http://localhost:8001/api/v2)",
    "API_Key": "<TOKEN>>"
  },
  "Objects": {
    "Base_URL": "<Objects base URL> (example http://localhost:8000/api/v2)",
    "API_Key": "<TOKEN>>"
  }
}

### Vite environment variables

For vite the following environment variables need to be located in the .env.local file for a development environment to work:

VITE_OBJECTTYPES_CONTAINER_URL=<internal objecttypes docker ip or hostname> (example: objecttypes-web)
VITE_OBJECTTYPES_CONTAINER_PORT=<internal objecttypes docker port> (example: 8000)
BFF_PORT=<port that BFF exposes> (example: 5007)
