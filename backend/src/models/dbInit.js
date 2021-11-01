import { Sequelize } from "sequelize";
import { DB_INFO } from "../../config/env.js"

export const sequelize = new Sequelize("notepad", DB_INFO.USER, DB_INFO.PASSWD, {
    "host": DB_INFO.HOSTNAME,
    "dialect": "mysql",
    "port": DB_INFO.PORT
});