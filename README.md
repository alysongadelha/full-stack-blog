# Frontend - React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Architecture

- Modular Architecture.

## TanStack Query

- Used to integrate the React with the backend services.

## Tests = Jest + playwright

- Unit tests with jest and E2E tests with playwright (the playwright tests skipped).

## Authorization

- As we are using a SPA, we are storing the user token in the context.

# Backend - NodeJs + Express + Mongoose

## Architecture

- A Rest API server using a MVC architecture variant (data-service-route)
- Route Layer: Define the router that customers can access;
- Service Layer: Define the CRUD, which access the database;
- Data Layer: Deal with the database and basic validations.

## Tests = Jest

- Unit tests with jest.

## Create Docker mongoDB

`docker run -d --name dbserver -p 27017:27017 --restart unless-stopped mongo:6.0.4`

-d: Runs the container in the background (daemon mode)
--name: Specifies the docker name
-p: Map the port (mongo default is 27017)
--restart unless-stopped: Restart container unless manually stopped.
mongo: Image that contains mongoDB

# Others

## Docker

- Created scripts to deploy the frontend and backend in the docker and use the image for google services.

## CI/CD Pipelines

- Created Github actions to handle automatic actions

## Husky

- To ensure the use of the [conventional commits specification](https://www.conventionalcommits.org/en/v1.0.0/).

## Eslint + Prettier

- To enforce best practices and code style.
