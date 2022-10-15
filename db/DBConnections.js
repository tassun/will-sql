"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDBConnector = exports.DBConnections = void 0;
const config_1 = __importDefault(require("config"));
const EnvironmentVariable_1 = require("../utils/EnvironmentVariable");
const Utilities_1 = require("../utils/Utilities");
const DBError_1 = require("./DBError");
const DBConfig_1 = require("./DBConfig");
class DBConnections {
    static getDBConnector(configure = { alias: EnvironmentVariable_1.DB_ALIAS, dialect: EnvironmentVariable_1.DB_DIALECT, url: EnvironmentVariable_1.DB_URL, user: EnvironmentVariable_1.DB_USER, password: EnvironmentVariable_1.DB_PASSWORD }) {
        //console.log("config",config);
        if (typeof configure === "string") {
            if (config_1.default.has(configure)) {
                let section = config_1.default.get(configure);
                DBConfig_1.dbconfig.alias = section["alias"];
                DBConfig_1.dbconfig.dialect = section["dialect"];
                DBConfig_1.dbconfig.url = section["url"];
                DBConfig_1.dbconfig.user = section["user"];
                DBConfig_1.dbconfig.password = section["password"];
            }
            else {
                throw new DBError_1.DBError("Database configuration '" + configure + "' not found", -10001);
            }
        }
        else {
            DBConfig_1.dbconfig.alias = configure.alias;
            DBConfig_1.dbconfig.dialect = configure.dialect;
            DBConfig_1.dbconfig.url = configure.url;
            DBConfig_1.dbconfig.user = configure.user;
            DBConfig_1.dbconfig.password = configure.password;
        }
        //console.log("dbconfig",dbconfig);
        if (Utilities_1.Utilities.equalsIgnoreCase(DBConfig_1.dbconfig.alias, "MYSQL")) {
            const MySQLDB = require("./mysql/MySQLDB");
            return new MySQLDB(Object.assign({}, DBConfig_1.dbconfig));
        }
        if (Utilities_1.Utilities.equalsIgnoreCase(DBConfig_1.dbconfig.alias, "ODBC")) {
            const OdbcDB = require("./odbc/OdbcDB");
            return new OdbcDB(DBConfig_1.dbconfig.dialect, Object.assign({}, DBConfig_1.dbconfig));
        }
        if (Utilities_1.Utilities.equalsIgnoreCase(DBConfig_1.dbconfig.alias, "MSSQL")) {
            const MsSQLDB = require("./mssql/MsSQLDB");
            return new MsSQLDB(Object.assign({}, DBConfig_1.dbconfig));
        }
        if (Utilities_1.Utilities.equalsIgnoreCase(DBConfig_1.dbconfig.alias, "ORACLE")) {
            const OracleDB = require("./oracle/OracleDB");
            return new OracleDB(Object.assign({}, DBConfig_1.dbconfig));
        }
        throw new DBError_1.DBError("Database configuration '" + DBConfig_1.dbconfig.alias + "' not supported", -10002);
    }
}
exports.DBConnections = DBConnections;
function getDBConnector(section) {
    return DBConnections.getDBConnector(section);
}
exports.getDBConnector = getDBConnector;
