import jsonServer from "json-server";
import { fileURLToPath } from "node:url";

const server = jsonServer.create();


const router = jsonServer.router(fileURLToPath(new URL("./db.json", import.meta.url)));


const middlewares = jsonServer.defaults();


const PORT = process.env.PORT || 3000;

server.use(middlewares);
server.use(router);
server.listen(PORT, () => console.log(`NyumbaSafe API running on port ${PORT}`));