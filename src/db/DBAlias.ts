import { DBConfig } from "./DBConfig";

enum DBAlias {
    MYSQL = "MYSQL", MSSQL = "MSSQL", ODBC = "ODBC", ORACLE = "ORACLE", POSTGRES = "POSTGRES" 
}

enum DBTypes {
    STRING = "STRING", INTEGER = "INTEGER", DECIMAL = "DECIMAL", BOOLEAN = "BOOLEAN", BIGINT = "BIGINT", 
    TEXT = "TEXT", DATE = "DATE", TIME = "TIME", DATETIME = "DATETIME", BLOB = "BLOB", CLOB = "CLOB"
}

type EnumDBTypes = keyof typeof DBTypes;

interface ResultSet {
    rows: any;
    columns: any;
}

interface SQLOptions {
    sql: string,
    options?: any;
}

interface DBValue {
    value: (string | number | boolean | bigint | null | undefined | Date | Buffer),
    type: (DBTypes | EnumDBTypes)
}

interface DBParam {
    [name: string] : DBValue;
}

class DBParamValue implements DBValue {
    constructor(
        public value: (string | number | boolean | bigint | null | undefined | Date | Buffer), 
        public type: (DBTypes | EnumDBTypes) = DBTypes.STRING) {
    }
}

interface DBConnector {
    readonly alias: DBAlias;
    readonly dialect: string;
    readonly config: DBConfig;
    
    init() : void;
    executeQuery(sql: string | SQLOptions, params?: DBParam) : Promise<ResultSet>;
    executeUpdate(sql: string| SQLOptions, params?: DBParam) : Promise<ResultSet>;
    execQuery(sql: SQLInterface) : Promise<ResultSet>;
    execUpdate(sql: SQLInterface) : Promise<ResultSet>;
    beginWork() : Promise<void>;
    commitWork() : Promise<void>;
    rollbackWork() : Promise<void>;
    reset() : void;
    close() : void;
    end() : void;
}

interface SQLInterface {
    clear() : void;
    clearParameter() : void;
    append(sql: string) : SQLInterface;
    set(paramname: string, 
        paramvalue: (string | number | boolean | bigint | null | undefined | Date | Buffer | DBParamValue), 
        paramtype: (DBTypes | EnumDBTypes)) : SQLInterface;
    param(name: string) : DBValue;
    executeQuery(db: DBConnector) : Promise<ResultSet>;
    executeUpdate(db: DBConnector) : Promise<ResultSet>;
    getSQLOptions(db: DBConnector) : [SQLOptions, DBParam];
}

export {
    DBAlias,
    ResultSet,
    DBValue,
    DBParam,
    DBParamValue,
    DBTypes,
    SQLOptions,
    SQLInterface,
    DBConnector    
}
