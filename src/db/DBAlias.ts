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
    beginWork() : Promise<void>;
    commitWork() : Promise<void>;
    rollbackWork() : Promise<void>;
    reset() : void;
    close() : void;
    end() : void;
}

export {
    DBAlias,
    ResultSet,
    DBValue,
    DBParam,
    DBParamValue,
    DBTypes,
    SQLOptions,
    DBConnector    
}
