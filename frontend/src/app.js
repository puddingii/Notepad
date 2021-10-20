import express from "express";
import morgan from "morgan";
import session from "express-session";
import MySQLStore from "express-mysql-session";
import http from "http";
import https from "https";
import fs from "fs";
import homeRouter from "./routers/homeRouter.js";

MySQLStore(session);

const clientApp = express();
const MysqlOptions = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "12345678",
    database: "notepad"
};

const appSetting = (app) => {
    app.use("/static", express.static("public"));
    app.use(morgan("dev"));
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());
    app.use("/node_modules", express.static("node_modules"));
};

appSetting(clientApp);
clientApp.set("views", `${process.cwd()}/public/views`);
clientApp.set("view engine", "pug");
clientApp.use(session({
    secret: "lksajdf3a3wporn3pinoflasd",
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(MysqlOptions)
}));
clientApp.use("/", homeRouter);

const httpsOptions = {
    key: fs.readFileSync(`${process.cwd()}/authentication/lesstif.com.key`).toString(),
    cert: fs.readFileSync(`${process.cwd()}/authentication/lesstif.com.crt`).toString(),

};

const HTTPPORT = 3500;
const HTTPSPORT = 3550;
const handleHttpListen = () => console.log(`Home Listening: http://localhost:${HTTPPORT}`);
const handleHttpsListen = () => console.log(`Home Listening: http://localhost:${HTTPSPORT}`);

http.createServer(clientApp).listen(HTTPPORT, handleHttpListen);
https.createServer(httpsOptions, clientApp).listen(HTTPSPORT, handleHttpsListen);