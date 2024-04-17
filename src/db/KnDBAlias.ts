import { KnDBConfig } from "./KnDBConfig";

enum KnDBAlias {
    MYSQL = "MYSQL", MSSQL = "MSSQL", ODBC = "ODBC", ORACLE = "ORACLE", POSTGRES = "POSTGRES", SQLITE = "SQLITE", MYSQL2 = "MYSQL2" 
}

enum KnDBDialect {
    MYSQL = "mysql", MSSQL = "mssql", ORACLE = "oracle", POSTGRES = "postgres", INFORMIX = "informix", DB2 = "db2", SQLITE = "sqlite"
}

enum KnDBTypes {
    STRING = "STRING", INTEGER = "INTEGER", DECIMAL = "DECIMAL", BOOLEAN = "BOOLEAN", BIGINT = "BIGINT", 
    TEXT = "TEXT", DATE = "DATE", TIME = "TIME", DATETIME = "DATETIME", BLOB = "BLOB", CLOB = "CLOB"
}

type KnEnumDBTypes = keyof typeof KnDBTypes;

interface KnDBValue {
    value: (string | number | boolean | bigint | null | undefined | Date | Buffer),
    type: (KnDBTypes | KnEnumDBTypes)
}

interface KnDBParam {
    [name: string] : KnDBValue;
}

class KnDBParamValue implements KnDBValue {
    constructor(
        public value: (string | number | boolean | bigint | null | undefined | Date | Buffer), 
        public type: (KnDBTypes | KnEnumDBTypes) = KnDBTypes.STRING) {
    }
}

interface KnDBConnector {
    readonly alias: KnDBAlias;
    readonly dialect: string;
    readonly config: KnDBConfig;
    
    init() : void;
    executeQuery(sql: string | KnSQLOptions, params?: KnDBParam) : Promise<KnResultSet>;
    executeUpdate(sql: string| KnSQLOptions, params?: KnDBParam) : Promise<KnResultSet>;
    execQuery(sql: KnSQLInterface) : Promise<KnResultSet>;
    execUpdate(sql: KnSQLInterface) : Promise<KnResultSet>;
    beginWork() : Promise<void>;
    commitWork() : Promise<void>;
    rollbackWork() : Promise<void>;
    reset() : void;
    close() : void;
    end() : void;
}

interface KnPageOffset {
    /**
     * Page number
     */
     page: number;
    /**
     * Number of records per page
     */
     rowsPerPage: number;
     /**
     * Total records
     */
    totalRows: number;
    /**
     * Total pages
     */
    totalPages: number;
    /**
     * Limit of result set
     */
     limit: number;
     /**
      * Offset to skip result set
      */
     offset: number;
}

interface KnResultSet {
    rows: any;
    columns: any;
    offsets?: KnPageOffset;
}

interface KnRecordSet extends KnResultSet {
    records: number;
}

interface KnSQLOptions {
    sql: string,
    options?: any;
}

interface KnSQLInterface {
    params : Map<string,KnDBValue>;
    clear() : void;
    clearParameter() : void;
    append(sql: string) : KnSQLInterface;
    set(paramname: string, 
        paramvalue: (string | number | boolean | bigint | null | undefined | Date | Buffer | KnDBParamValue), 
        paramtype?: (KnDBTypes | KnEnumDBTypes)) : KnSQLInterface;
    param(name: string) : KnDBValue;
    executeQuery(db: KnDBConnector, ctx?: any) : Promise<KnResultSet>;
    executeUpdate(db: KnDBConnector, ctx?: any) : Promise<KnResultSet>;
    getSQLOptions(db: KnDBConnector) : [KnSQLOptions, KnDBParam];
}

export {
    KnDBAlias,
    KnDBDialect,
    KnDBTypes,
    KnEnumDBTypes,
    KnDBValue,
    KnDBParam,
    KnDBParamValue,
    KnDBConnector, 
    KnPageOffset,   
    KnResultSet,
    KnRecordSet,
    KnSQLOptions,
    KnSQLInterface
}
