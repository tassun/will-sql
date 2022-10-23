import { DBConfig } from "./DBConfig";

enum DBAlias {
    MYSQL = "MYSQL", MSSQL = "MSSQL", ODBC = "ODBC", ORACLE = "ORACLE", POSTGRES = "POSTGRES" 
}

enum DBDialect {
    MYSQL = "mysql", MSSQL = "mssql", ORACLE = "oracle", POSTGRES = "postgres", INFORMIX = "informix", DB2 = "db2"
}

enum DBTypes {
    STRING = "STRING", INTEGER = "INTEGER", DECIMAL = "DECIMAL", BOOLEAN = "BOOLEAN", BIGINT = "BIGINT", 
    TEXT = "TEXT", DATE = "DATE", TIME = "TIME", DATETIME = "DATETIME", BLOB = "BLOB", CLOB = "CLOB"
}

type EnumDBTypes = keyof typeof DBTypes;

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

interface PageOffset {
    /**
     * Total records
     */
    total: number;
    /**
     * Limit of result set
     */
    limit: number;
    /**
     * Page number
     */
    page: number;
    /**
     * Offset to skip result set
     */
    offset: number;
    /**
     * Records per page
     */
    chapter: number;
}

interface ResultSet {
    rows: any;
    columns: any;
    offsets?: PageOffset;
}

interface SQLOptions {
    sql: string,
    options?: any;
}

interface SQLInterface {
    params : Map<string,DBValue>;
    clear() : void;
    clearParameter() : void;
    append(sql: string) : SQLInterface;
    set(paramname: string, 
        paramvalue: (string | number | boolean | bigint | null | undefined | Date | Buffer | DBParamValue), 
        paramtype?: (DBTypes | EnumDBTypes)) : SQLInterface;
    param(name: string) : DBValue;
    executeQuery(db: DBConnector) : Promise<ResultSet>;
    executeUpdate(db: DBConnector) : Promise<ResultSet>;
    getSQLOptions(db: DBConnector) : [SQLOptions, DBParam];
}

export {
    DBAlias,
    DBDialect,
    DBTypes,
    DBValue,
    DBParam,
    DBParamValue,
    DBConnector, 
    PageOffset,   
    ResultSet,
    SQLOptions,
    SQLInterface
}
