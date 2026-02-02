import { Utilities } from "will-util";
import { KnDBAlias, KnDBDialect, KnDBTypes, KnDBParam, KnDBValue, KnSQLOptions, KnSQLInterface } from "./KnDBAlias";
import { KnDBConfig } from "./KnDBConfig";
import { KnDBError } from "./KnDBError";

const RESERVE_QUERIES = ["insert","update","delete","drop","alter","execute","exec","truncate"];

export class KnDBUtils {
    public static parseDBTypes(type:string | KnDBTypes) : KnDBTypes {
        if (typeof type !== "string") {
            return type;
        }
        const t = type.toUpperCase();
        const typeMap: Record<string, KnDBTypes> = {
            INTEGER: KnDBTypes.INTEGER,
            NUMBER: KnDBTypes.INTEGER,
            DECIMAL: KnDBTypes.DECIMAL,
            BOOLEAN: KnDBTypes.BOOLEAN,
            BIGINT: KnDBTypes.BIGINT,
            TEXT: KnDBTypes.TEXT,
            DATE: KnDBTypes.DATE,
            TIME: KnDBTypes.TIME,
            DATETIME: KnDBTypes.DATETIME,
            BLOB: KnDBTypes.BLOB,
            CLOB: KnDBTypes.CLOB
        };
        return typeMap[t] ?? KnDBTypes.STRING;
    }

    public static parseDBAlias(alias: (string | KnDBAlias)) : KnDBAlias {
        if (typeof alias !== "string") {
            return alias;
        }
        const key = alias.toUpperCase();
        const aliasMap: Record<string, KnDBAlias> = {
            MYSQL: KnDBAlias.MYSQL,
            MYSQL2: KnDBAlias.MYSQL2,
            MSSQL: KnDBAlias.MSSQL,
            ODBC: KnDBAlias.ODBC,
            ORACLE: KnDBAlias.ORACLE,
            POSTGRES: KnDBAlias.POSTGRES,
            SQLITE: KnDBAlias.SQLITE
        };
        const result = aliasMap[key];
        if (result === undefined) {
            throw new KnDBError(`Unknown alias '${alias}'`, -10201);
        }
        return result;
    }

    public static parseDBDialect(dialect: (string | KnDBDialect)) : KnDBDialect {
        if (typeof dialect !== "string") {
            return dialect;
        }
        const key = dialect.toUpperCase();  
        const dialectMap: Record<string, KnDBDialect> = {
            MYSQL: KnDBDialect.MYSQL,
            MSSQL: KnDBDialect.MSSQL,
            ORACLE: KnDBDialect.ORACLE,
            POSTGRES: KnDBDialect.POSTGRES,
            INFORMIX: KnDBDialect.INFORMIX,
            DB2: KnDBDialect.DB2,
            SQLITE: KnDBDialect.SQLITE
        };
        const result = dialectMap[key];
        if (result === undefined) {
            throw new KnDBError(`Unknown dialect '${dialect}'`, -10202);
        }
        return result;
    }

    public static parseSQLOptions(query: string | KnSQLOptions) : KnSQLOptions | undefined {
        if(typeof query === "string") {
            return undefined;
        } else {
            return query;
        }
    }

    public static parseParamValue(param: KnDBValue, dialect?: string) : any {
        let paramType = this.parseDBTypes(param.type);
        if(paramType==KnDBTypes.DECIMAL || paramType==KnDBTypes.BIGINT || paramType==KnDBTypes.INTEGER) {
            return Utilities.parseFloat(param.value);
        } else if(paramType==KnDBTypes.DATE || paramType==KnDBTypes.DATETIME) {
            return Utilities.parseDate(param.value);
        } else if(paramType==KnDBTypes.TIME) {
            if(param.value instanceof Date && "pg"==dialect) {
                return Utilities.getHMS(param.value);
            }
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

    public static extractDBParam(params?: KnDBParam, dialect?: string) : [any, string[], string[]] {        
        let paravalues = [];
        let paranames = [];
        let paratypes = [];
        if(params) {
            for(let p in params) {
                let pv = params[p];
                paranames.push(p);
                paravalues.push(this.parseParamValue(pv,dialect));
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
    
    public static hasIntensiveQuery(query: string | undefined | null) : boolean {
        if(!query || query.trim().length==0) return false;
        let q = query.toLowerCase();
        return RESERVE_QUERIES.some(key => q.includes(key));
    }

}