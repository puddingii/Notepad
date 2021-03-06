import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import session from "express-session";
import MySQLStore from "express-mysql-session";
import https from "https";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { SECURE_INFO } from "../config/env.js";
import homeRouter from "./routers/homeController.js";
import SocketController from "./routers/socketController.js";
import Singleton from "./singleton.js";

MySQLStore(session);

const clientApp = express();
const cspOptioins = {
    directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "*.jsdelivr.net", "*.jquery.com", "cdn.socket.io"],
        "default-src": ["'self'", "localhost:8050"],
    }
};

const appSetting = (app) => {
    // CSP설정으로 XSS 공격, 교차 사이트 인젝션 등의 예방, CSP는 신뢰할 수 있는 컨텐츠 소스의 화이트리스트 설정을 함.
    // 안전한(SSL/TLS를 통한 HTTP) 연결을 적용하는 Strict-Transport-Security 헤더를 설정, HSTS는 프로토콜 다운그레이드 공격, 쿠키 하이재킹을 막는데 도움줌.
    app.use(helmet({ contentSecurityPolicy: cspOptioins }));
    app.use("/static", express.static("public"));
    app.use(morgan("dev"));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use("/node_modules", express.static("node_modules"));
};

appSetting(clientApp);
clientApp.set("views", `${process.cwd()}/src/views`);
clientApp.set("view engine", "pug");
clientApp.use(session({
    cookie: { secure: true },
    secret: SECURE_INFO.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
clientApp.use("/", homeRouter);

const httpsOptions = {
    rejectedUnauthorized: false,
    key: SECURE_INFO.HTTPS_KEY,
    cert: SECURE_INFO.HTTPS_CERT,
};

const server = https.createServer(httpsOptions, clientApp);

const io = new Server(server, {
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true
    }
});
instrument(io, { auth: false });
const onConnection = (socket) => {
    const socketController = new SocketController(io, socket);
    socketController.init(Singleton.roomInfo);
};
io.on("connection", onConnection);

const handleHttpsListen = () => console.log(`Home Listening: https://localhost:${SECURE_INFO.HTTPSPORT}`);
server.listen(SECURE_INFO.HTTPSPORT, handleHttpsListen);