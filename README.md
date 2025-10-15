# boom README

## Installation

docker
npm
dotnet

## Environment variables

The following environment variables need to be set in the `.env.local` file:
`BFF_PORT`: needs to be set to the port number the BFF uses. Default value is 5007.
`OBJECTTYPES_BASE_URL`: needs to direct to the base URL of the Object Types API. Example: "http://object.types.nl/api/v2".
For the demo setup it needs to be the same as the objecttypes container: "http://objecttypes-web:8000/api/v2"
`OBJECTTYPES_API_KEY`: The API key that is setup in the Object Types API dashboard.
For the demo setup the following token is pre-loaded: ba9d233e95e04c4a8a661a27daffe7c9bd019067
`OBJECTS_BASE_URL`: needs to direct to the base URL of the Objects API. Example: "http://objects.nl/api/v2".
For the demo setup it needs to be the same as the objecttypes container: "http://web:8000/api/v2"
`OBJECTS_API_KEY`: The API key that is setup in the Objects API dashboard.
For the demo setup the following token is pre-loaded: ba9d233e95e04c4a8a661a27daffe7c9bd019067

## Demo setup

Clone this repository and follow the steps below.

### Setup objects-api

A demo version with the objects-api is available in the `objects-api-demo` folder.
To run do the following:

1. Open a command prompt and navigate to the `objects-api-demo` folder
2. run `docker compose up`
3. Open a browser. Navigate to "http://localhost:8000/admin". Login using: username: daan | password: icatt

### Setup boom-app

The boom-app can be run in a docker container by doing the following:

1. Open a command prompt and navigate to the `boom-app` folder
2. Run `docker compose build`
3. Run `docker compose up`
4. Open a NEW web browser window and navigate to "http://localhost:8080"
