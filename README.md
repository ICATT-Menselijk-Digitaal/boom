# BOOM-app — Bulk Overige Objecten Mapping

The BOOM-app is a tool that enables bulk importing of objects into the **Objecten API**, that is part of the Common Ground architecture used in Dutch open source civic tech projects.

## Background

The **Objecten API** is a register for data that has no dedicated database, such as trees, monuments, or citizen reports. These are called _Overige Objecten_.

An _Objecttype_ defines the shape of the data, while _Objects_ hold the actual records.

The API, however, currently only supports creating objects one by one through manual entry.

The BOOM-app solves this by enabling bulk import via CSV upload.

## Tech Stack

| **Layer**            | **Technology**                     |
| -------------------- | ---------------------------------- |
| Frontend Framework   | Vue 3 + TypeScript                 |
| Backend For Frontend | .NET/C#                            |
| Routing              | Vue Router/Single Page Application |
| CSV parsing          | PapaParse                          |
| Hosting/Runtime      | Docker                             |

## Architecture

The BOOM-app runs as a Docker container containing both the Vue frontend and the .NET Backend for Frontend (BFF).

It communicates with two external services, also containerized:

- the **Objecttypes API** (which defines the data shape)
- the **Objecten API** (which stores the objects).

## How It Works

The import flow consists of four steps:

1. **Upload** — The user selects a .csv file containing a set of objects that need to be entered into the Objecten API. The file contains a header row with property names and data rows where each row represents one object to be imported.
1. **Map** — The user selects an existing Objecttype from the Objecttypes API that represents the objects that will be entered. The app displays the Objecttype properties and CSV headers side by side. It performs an automatic mapping of properties to headernames, and allows manual adjustments.
1. **Preview & Validate** — To satisfy the user the mapping was done correctly, the app shows the full mapping and an example object (based on the first CSV row rendered in the mapped structure), giving the user a chance to catch mistakes.
1. **Results** — After the import runs, the app reports how many objects were successfully created and which rows encountered errors and why, allowing the user to fix and retry if needed. During import the app checks for duplicates and will not enter any objects where all property fields match to an object already in the API.


## Installation

For installation the following is required:

- docker
- npm
- dotnet

## Environment variables

The following environment variables need to be set in the `.env.local` file:

`VITE_BFF_PORT`: needs to be set to the port number the BFF uses. Default value is 5007.

`OBJECTTYPES_BASE_URL`: needs to direct to the base URL of the Object Types API. Example: "http://object.types.nl/api/v2".
For the demo setup it needs to be the same as the objecttypes container: "http://objecttypes-web:8000/api/v2"

`OBJECTTYPES_API_KEY`: The API key that is setup in the Object Types API dashboard.
For the demo setup the following token is pre-loaded: ba9d233e95e04c4a8a661a27daffe7c9bd019067

`OBJECTS_BASE_URL`: needs to direct to the base URL of the Objects API. Example: "http://objects.nl/api/v2".
For the demo setup it needs to be the same as the objecttypes container: "http://web:8000/api/v2"

`OBJECTS_API_KEY`: The API key that is setup in the Objects API dashboard.
For the demo setup the following token is pre-loaded: ba9d233e95e04c4a8a661a27daffe7c9bd019067

### Dev environment

To work in the Development environment setup all the environment variables as **user secrets** for the dotnet project.

NOTE
Working with the docker objects-api environment can run into problems because of the use of the internal docker network.
If you run the boom-app outside of the objects-api docker network, there will be problems when searching and adding new objects.

## Demo setup

Clone this repository and follow the steps below.

### Setup objects-api

A demo version with the objects-api is available in the `objects-api-demo` folder.

To run do the following:

1. Open a command prompt and navigate to the `objects-api-demo` folder
2. run `docker compose up`
3. Open a browser. Navigate to "http://localhost:8000/admin".

   Login using:

   username: daan

   password: icatt

### Setup boom-app

The boom-app can be run in a docker container by doing the following:

1. Open a command prompt and navigate to the `boom-app` folder
2. Run `docker compose build`
3. Run `docker compose up`
4. Open a NEW web browser window and navigate to "http://localhost:8080"

### Demo file

A test CSV file is provided to create 2 bomen.
