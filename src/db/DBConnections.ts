import config from "will-util";
import { Utilities } from "will-util";
import { DB_SCHEMA, DB_URL, DB_ALIAS, DB_DIALECT, DB_USER, DB_PASSWORD } from "./DBVariable";
import { DBError } from './DBError';
import { DBConnector } from "./DBAlias";
import { DBConfig, dbconfig } from "./DBConfig";

export class DBConnections {
    public static getDBConnector(configure: (string | DBConfig) = {schema: DB_SCHEMA, alias: DB_ALIAS, dialect: DB_DIALECT, url: DB_URL, user: DB_USER, password: DB_PASSWORD}) : DBConnector {
        //console.log("config",config);
        if(typeof configure === "string") {
            if(config.has(configure)) {
                let section = config.get(configure) as DBConfig;
                dbconfig.schema = configure;
                dbconfig.alias = section["alias"];
                dbconfig.dialect = section["dialect"];
                dbconfig.url = section["url"];
                dbconfig.user = section["user"];
                dbconfig.password = section["password"];
                dbconfig.options = section["options"];
            } else {
                throw new DBError("Database configuration '"+configure+"' not found",-10001);
            }
        } else {
            dbconfig.schema = configure.schema;
            dbconfig.alias = configure.alias;
            dbconfig.dialect = configure.dialect;
            dbconfig.url = configure.url;
            dbconfig.user = configure.user;
            dbconfig.password = configure.password;
            dbconfig.options = configure.options;
        }
        //console.log("dbconfig",dbconfig);
        if(Utilities.equalsIgnoreCase(dbconfig.alias,"MYSQL")) {
            const MySQLDB = require("./mysql/MySQLDB");
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
        throw new DBError("Database alias '"+dbconfig.alias+"' not supported",-10002);
    }
}

export function getDBConnector(section:string) {
    return DBConnections.getDBConnector(section);
}
