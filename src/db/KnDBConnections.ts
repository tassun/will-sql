import config from "will-util";
import { Utilities } from "will-util";
import { DB_SCHEMA, DB_URL, DB_ALIAS, DB_DIALECT, DB_USER, DB_PASSWORD } from "./KnDBVariable";
import { KnDBError } from './KnDBError';
import { KnDBConnector } from "./KnDBAlias";
import { KnDBConfig, dbconfig } from "./KnDBConfig";

export class KnDBConnections {
    public static getDBConnector(configure: (string | KnDBConfig) = {schema: DB_SCHEMA, alias: DB_ALIAS, dialect: DB_DIALECT, url: DB_URL, user: DB_USER, password: DB_PASSWORD}) : KnDBConnector {
        //console.log("config",config);
        if(typeof configure === "string") {
            if(config.has(configure)) {
                let section = config.get(configure) as KnDBConfig;
                dbconfig.schema = configure;
                dbconfig.alias = section["alias"];
                dbconfig.dialect = section["dialect"];
                dbconfig.url = section["url"];
                dbconfig.user = section["user"];
                dbconfig.password = section["password"];
                dbconfig.host = section["host"];
                dbconfig.port = section["port"];
                dbconfig.database = section["database"];
                dbconfig.options = section["options"];
            } else {
                throw new KnDBError("Database configuration '"+configure+"' not found",-10001);
            }
        } else {
            dbconfig.schema = configure.schema;
            dbconfig.alias = configure.alias;
            dbconfig.dialect = configure.dialect;
            dbconfig.url = configure.url;
            dbconfig.user = configure.user;
            dbconfig.password = configure.password;
            dbconfig.host = configure.host;
            dbconfig.port = configure.port;
            dbconfig.database = configure.database;
            dbconfig.options = configure.options;
        }
        //console.log("dbconfig",dbconfig);
        if(Utilities.equalsIgnoreCase(dbconfig.alias,"MYSQL")) {
            const MySQLDB = require("./mysql/MySQLDB");
            return new MySQLDB({...dbconfig});
        }
        if(Utilities.equalsIgnoreCase(dbconfig.alias,"MYSQL2")) {
            const MySQLDB = require("./mysql2/MySQLDB");
            return new MySQLDB({...dbconfig});
        }
        if(Utilities.equalsIgnoreCase(dbconfig.alias,"ODBC")) {
            const OdbcDB = require("./odbc/OdbcDB");
            return new OdbcDB(dbconfig.dialect,{...dbconfig});
        }
        if(Utilities.equalsIgnoreCase(dbconfig.alias,"MSSQL")) {
            const MsSQLDB = require("./mssql/MsSQLDB");
            return new MsSQLDB({...dbconfig});
        }
        if(Utilities.equalsIgnoreCase(dbconfig.alias,"ORACLE")) {
            const OracleDB = require("./oracle/OracleDB");
            return new OracleDB({...dbconfig});
        }
        if(Utilities.equalsIgnoreCase(dbconfig.alias,"POSTGRES")) {
            const PgSQLDB = require("./postgres/PgSQLDB");
            return new PgSQLDB({...dbconfig});
        }
        if(Utilities.equalsIgnoreCase(dbconfig.alias,"SQLITE")) {
            const SQLiteDB = require("./sqlite/SQLiteDB");
            return new SQLiteDB({...dbconfig});
        }
        throw new KnDBError("Database alias '"+dbconfig.alias+"' not supported",-10002);
    }
}

export function getDBConnector(section:string) {
    return KnDBConnections.getDBConnector(section);
}
