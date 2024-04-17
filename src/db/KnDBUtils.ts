import { Utilities } from "will-util";
import { KnDBAlias, KnDBDialect, KnDBTypes, KnDBParam, KnDBValue, KnSQLOptions, KnSQLInterface } from "./KnDBAlias";
import { KnDBConfig } from "./KnDBConfig";
import { KnDBError } from "./KnDBError";

export class KnDBUtils {
    public static parseDBTypes(type:string | KnDBTypes) : KnDBTypes {
        if(typeof type === "string") {
            if(Utilities.equalsIgnoreCase(type,"INTEGER") || Utilities.equalsIgnoreCase(type,"NUMBER")) return KnDBTypes.INTEGER;
            if(Utilities.equalsIgnoreCase(type,"DECIMAL")) return KnDBTypes.DECIMAL;
            if(Utilities.equalsIgnoreCase(type,"BOOLEAN")) return KnDBTypes.BOOLEAN;
            if(Utilities.equalsIgnoreCase(type,"BIGINT")) return KnDBTypes.BIGINT;
            if(Utilities.equalsIgnoreCase(type,"TEXT")) return KnDBTypes.TEXT;
            if(Utilities.equalsIgnoreCase(type,"DATE")) return KnDBTypes.DATE;
            if(Utilities.equalsIgnoreCase(type,"TIME")) return KnDBTypes.TIME;
            if(Utilities.equalsIgnoreCase(type,"DATETIME")) return KnDBTypes.DATETIME;
            if(Utilities.equalsIgnoreCase(type,"BLOB")) return KnDBTypes.BLOB;
            if(Utilities.equalsIgnoreCase(type,"CLOB")) return KnDBTypes.CLOB;
            return KnDBTypes.STRING;
        } else {
            return type;
        }
    }

    public static parseDBAlias(alias: (string | KnDBAlias)) : KnDBAlias {
        if(typeof alias === "string") {
            if(Utilities.equalsIgnoreCase("MYSQL",alias)) return KnDBAlias.MYSQL;
            if(Utilities.equalsIgnoreCase("MYSQL2",alias)) return KnDBAlias.MYSQL2;
            if(Utilities.equalsIgnoreCase("MSSQL",alias)) return KnDBAlias.MSSQL;
            if(Utilities.equalsIgnoreCase("ODBC",alias)) return KnDBAlias.ODBC;
            if(Utilities.equalsIgnoreCase("ORACLE",alias)) return KnDBAlias.ORACLE;
            if(Utilities.equalsIgnoreCase("POSTGRES",alias)) return KnDBAlias.POSTGRES;
            if(Utilities.equalsIgnoreCase("SQLITE",alias)) return KnDBAlias.SQLITE;
            throw new KnDBError("Unknown alias '"+alias+"'",-10201);
        } else {
            return alias;
        }
    }

    public static parseDBDialect(dialect: (string | KnDBDialect)) : KnDBDialect {
        if(typeof dialect === "string") {
            if(Utilities.equalsIgnoreCase("mysql",dialect)) return KnDBDialect.MYSQL;
            if(Utilities.equalsIgnoreCase("mssql",dialect)) return KnDBDialect.MSSQL;
            if(Utilities.equalsIgnoreCase("oracle",dialect)) return KnDBDialect.ORACLE;
            if(Utilities.equalsIgnoreCase("postgres",dialect)) return KnDBDialect.POSTGRES;
            if(Utilities.equalsIgnoreCase("informix",dialect)) return KnDBDialect.INFORMIX;
            if(Utilities.equalsIgnoreCase("db2",dialect)) return KnDBDialect.DB2;
            if(Utilities.equalsIgnoreCase("sqlite",dialect)) return KnDBDialect.SQLITE;
            throw new KnDBError("Unknown dialect '"+dialect+"'",-10202);
        } else {
            return dialect;
        }
    }

    public static parseSQLOptions(query: string | KnSQLOptions) : KnSQLOptions | undefined {
        if(typeof query === "string") {
            return undefined;
        } else {
            return query;
        }
    }

    public static parseParamValue(param: KnDBValue) : any {
        let paramType = this.parseDBTypes(param.type);
        if(paramType==KnDBTypes.DECIMAL || paramType==KnDBTypes.BIGINT || paramType==KnDBTypes.INTEGER) {
            return Utilities.parseFloat(param.value);
        } else if(paramType==KnDBTypes.DATE || paramType==KnDBTypes.DATETIME) {
            return Utilities.parseDate(param.value);
        }
        return param.value;
    }

    public static getQuery(query: string | KnSQLOptions) : string {
        if(typeof query === "string") {
            return query;
        } else {
            return query.sql;
        }
    }

    public static extractDBParam(params?: KnDBParam) : [any, string[], string[]] {        
        let paravalues = [];
        let paranames = [];
        let paratypes = [];
        if(params) {
            for(let p in params) {
                let pv = params[p];
                paranames.push(p);
                paravalues.push(this.parseParamValue(pv));
                paratypes.push(pv.type);
            }
        }
        return [paravalues, paranames, paratypes];
    }

    public static isSQLInterface(element: unknown) : element is KnSQLInterface {
        return Utilities.hasAttributes(element,  ["sql", "params"]) &&
        typeof element.sql === "string" &&
        typeof element.params === "object";
    }

    public static isMYSQL(config: KnDBConfig) : boolean {
        return this.parseDBDialect(config.dialect)==KnDBDialect.MYSQL;
    }
    public static isDB2(config: KnDBConfig) : boolean {
        return this.parseDBDialect(config.dialect)==KnDBDialect.DB2;
    }
    public static isMSSQL(config: KnDBConfig) : boolean {
        return this.parseDBDialect(config.dialect)==KnDBDialect.MSSQL;
    }
    public static isINFORMIX(config: KnDBConfig) : boolean {
        return this.parseDBDialect(config.dialect)==KnDBDialect.INFORMIX;
    }
    public static isORACLE(config: KnDBConfig) : boolean {
        return this.parseDBDialect(config.dialect)==KnDBDialect.ORACLE;
    }
    public static isPOSTGRES(config: KnDBConfig) : boolean {
        return this.parseDBDialect(config.dialect)==KnDBDialect.POSTGRES;
    }
    public static isSQLITE(config: KnDBConfig) : boolean {
        return this.parseDBDialect(config.dialect)==KnDBDialect.SQLITE;
    }
}