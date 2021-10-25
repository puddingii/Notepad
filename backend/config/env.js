import fs from "fs";

export const DB_INFO = {
    HOSTNAME: "localhost",
    PORT: 3306,
    USER: "root",
    PASSWD: "12345678",
};


export const SECURE_INFO = {
    SESSION_SECRET: "lksajdf3a3wporn3pinoflasd",
    // HTTPS_KEY: fs.readFileSync(`${process.cwd()}/authentication/lesstif.com.key`).toString(),
    // HTTPS_CERT: fs.readFileSync(`${process.cwd()}/authentication/lesstif.com.crt`).toString(),
    HTTPS_KEY: fs.readFileSync(`${process.cwd()}/test_auth/server.key`).toString(),
    HTTPS_CERT: fs.readFileSync(`${process.cwd()}/test_auth/server.crt`).toString(),
    HTTPSPORT: 8050
};
