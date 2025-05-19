# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Create Docker mongoDB

`docker run -d --name dbserver -p 27017:27017 --restart unless-stopped mongo:6.0.4`

-d: Runs the container in the background (daemon mode)
--name: Specifies the docker name
-p: Map the port (mongo default is 27017)
--restart unless-stopped: Restart container unless manually stopped.
mongo: Image that contains mongoDB
