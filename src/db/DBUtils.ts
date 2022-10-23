import { Utilities } from "../utils/Utilities";
import { DBAlias, DBDialect, DBTypes, SQLOptions, DBParam, SQLInterface } from "./DBAlias";
import { DBError } from "./DBError";

export class DBUtils {
    public static parseDBTypes(type:string | DBTypes) : DBTypes {
        if(typeof type === "string") {
            if(Utilities.equalsIgnoreCase(type,"INTEGER") || Utilities.equalsIgnoreCase(type,"NUMBER")) return DBTypes.INTEGER;
            if(Utilities.equalsIgnoreCase(type,"DECIMAL")) return DBTypes.DECIMAL;
            if(Utilities.equalsIgnoreCase(type,"BOOLEAN")) return DBTypes.BOOLEAN;
            if(Utilities.equalsIgnoreCase(type,"BIGINT")) return DBTypes.BIGINT;
            if(Utilities.equalsIgnoreCase(type,"TEXT")) return DBTypes.TEXT;
            if(Utilities.equalsIgnoreCase(type,"DATE")) return DBTypes.DATE;
            if(Utilities.equalsIgnoreCase(type,"TIME")) return DBTypes.TIME;
            if(Utilities.equalsIgnoreCase(type,"DATETIME")) return DBTypes.DATETIME;
            if(Utilities.equalsIgnoreCase(type,"BLOB")) return DBTypes.BLOB;
            if(Utilities.equalsIgnoreCase(type,"CLOB")) return DBTypes.CLOB;
            return DBTypes.STRING;
        } else {
            return type;
        }
    }

    public static parseDBAlias(alias: (string | DBAlias)) : DBAlias {
        if(typeof alias === "string") {
            if(Utilities.equalsIgnoreCase("MYSQL",alias)) return DBAlias.MYSQL;
            if(Utilities.equalsIgnoreCase("MSSQL",alias)) return DBAlias.MSSQL;
            if(Utilities.equalsIgnoreCase("ODBC",alias)) return DBAlias.ODBC;
            if(Utilities.equalsIgnoreCase("ORACLE",alias)) return DBAlias.ORACLE;
            if(Utilities.equalsIgnoreCase("POSTGRES",alias)) return DBAlias.POSTGRES;
            throw new DBError("Unknown alias '"+alias+"'",-10201);
        } else {
            return alias;
        }
    }

    public static parseDBDialect(dialect: (string | DBDialect)) : DBDialect {
        if(typeof dialect === "string") {
            if(Utilities.equalsIgnoreCase("mysql",dialect)) return DBDialect.MYSQL;
            if(Utilities.equalsIgnoreCase("mssql",dialect)) return DBDialect.MSSQL;
            if(Utilities.equalsIgnoreCase("oracle",dialect)) return DBDialect.ORACLE;
            if(Utilities.equalsIgnoreCase("postgres",dialect)) return DBDialect.POSTGRES;
            if(Utilities.equalsIgnoreCase("informix",dialect)) return DBDialect.INFORMIX;
            if(Utilities.equalsIgnoreCase("db2",dialect)) return DBDialect.DB2;
            throw new DBError("Unknown dialect '"+dialect+"'",-10202);
        } else {
            return dialect;
        }
    }

    public static parseSQLOptions(query: string | SQLOptions) : SQLOptions | undefined {
        if(typeof query === "string") {
            return undefined;
        } else {
            return query;
        }
    }

    public static getQuery(query: string | SQLOptions) : string {
        if(typeof query === "string") {
            return query;
        } else {
            return query.sql;
        }
    }

    public static extractDBParam(params?: DBParam) : [any, string[], string[]] {        
        let paravalues = [];
        let paranames = [];
        let paratypes = [];
        if(params) {
            for(let p in params) {
                let pv = params[p];
                paranames.push(p);
                paravalues.push(pv.value);
                paratypes.push(pv.type);
            }
        }
        return [paravalues, paranames, paratypes];
    }

    public static isSQLInterface(element: unknown) : element is SQLInterface {
        return Utilities.hasAttributes(element,  ["sql", "params"]) &&
        typeof element.sql === "string" &&
        typeof element.params === "object";
    }

}