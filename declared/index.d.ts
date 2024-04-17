declare enum KnDBAlias {
    MYSQL = "MYSQL",
    MSSQL = "MSSQL",
    ODBC = "ODBC",
    ORACLE = "ORACLE",
    POSTGRES = "POSTGRES",
    SQLITE = "SQLITE",
    MYSQL2 = "MYSQL2"
}
declare enum KnDBDialect {
    MYSQL = "mysql",
    MSSQL = "mssql",
    ORACLE = "oracle",
    POSTGRES = "postgres",
    INFORMIX = "informix",
    DB2 = "db2",
    SQLITE = "sqlite"
}
declare enum KnDBTypes {
    STRING = "STRING",
    INTEGER = "INTEGER",
    DECIMAL = "DECIMAL",
    BOOLEAN = "BOOLEAN",
    BIGINT = "BIGINT",
    TEXT = "TEXT",
    DATE = "DATE",
    TIME = "TIME",
    DATETIME = "DATETIME",
    BLOB = "BLOB",
    CLOB = "CLOB"
}
declare type KnEnumDBTypes = keyof typeof KnDBTypes;
interface KnDBValue {
    value: (string | number | boolean | bigint | null | undefined | Date | Buffer);
    type: (KnDBTypes | KnEnumDBTypes);
}
interface KnDBParam {
    [name: string]: KnDBValue;
}
declare class KnDBParamValue implements KnDBValue {
    value: (string | number | boolean | bigint | null | undefined | Date | Buffer);
    type: (KnDBTypes | KnEnumDBTypes);
    constructor(value: (string | number | boolean | bigint | null | undefined | Date | Buffer), type?: (KnDBTypes | KnEnumDBTypes));
}
interface KnDBConnector {
    readonly alias: KnDBAlias;
    readonly dialect: string;
    readonly config: KnDBConfig;
    init(): void;
    executeQuery(sql: string | KnSQLOptions, params?: KnDBParam): Promise<KnResultSet>;
    executeUpdate(sql: string | KnSQLOptions, params?: KnDBParam): Promise<KnResultSet>;
    execQuery(sql: KnSQLInterface): Promise<KnResultSet>;
    execUpdate(sql: KnSQLInterface): Promise<KnResultSet>;
    beginWork(): Promise<void>;
    commitWork(): Promise<void>;
    rollbackWork(): Promise<void>;
    reset(): void;
    close(): void;
    end(): void;
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
    sql: string;
    options?: any;
}
interface KnSQLInterface {
    params: Map<string, KnDBValue>;
    clear(): void;
    clearParameter(): void;
    append(sql: string): KnSQLInterface;
    set(paramname: string, paramvalue: (string | number | boolean | bigint | null | undefined | Date | Buffer | KnDBParamValue), paramtype?: (KnDBTypes | KnEnumDBTypes)): KnSQLInterface;
    param(name: string): KnDBValue;
    executeQuery(db: KnDBConnector, ctx?: any): Promise<KnResultSet>;
    executeUpdate(db: KnDBConnector, ctx?: any): Promise<KnResultSet>;
    getSQLOptions(db: KnDBConnector): [KnSQLOptions, KnDBParam];
}
export { KnDBAlias, KnDBDialect, KnDBTypes, KnEnumDBTypes, KnDBValue, KnDBParam, KnDBParamValue, KnDBConnector, KnPageOffset, KnResultSet, KnRecordSet, KnSQLOptions, KnSQLInterface };

export interface KnDBConfig {
    schema: string;
    alias: string;
    dialect: string;
    url: string;
    user: string;
    password: string;
    host?: string;
    port?: number;
    database?: string;
    options?: any;
}
export declare const dbconfig: KnDBConfig;

export declare type KnEnumDBAlias = keyof typeof KnDBAlias;
export declare abstract class KnDBConnect implements KnDBConnector {
    readonly alias: KnDBAlias;
    readonly dialect: string;
    readonly config: KnDBConfig;
    constructor(alias: (KnDBAlias | KnEnumDBAlias), dialect: string, config: KnDBConfig);
    init(): Promise<void>;
    protected doExecuteQuery(sql: string | KnSQLOptions, params?: KnDBParam): Promise<KnResultSet>;
    protected doExecuteUpdate(sql: string | KnSQLOptions, params?: KnDBParam): Promise<KnResultSet>;
    executeQuery(sql: string | KnSQLOptions, params?: KnDBParam): Promise<KnResultSet>;
    executeUpdate(sql: string | KnSQLOptions, params?: KnDBParam): Promise<KnResultSet>;
    execQuery(sql: KnSQLInterface): Promise<KnResultSet>;
    execUpdate(sql: KnSQLInterface): Promise<KnResultSet>;
    beginWork(): Promise<void>;
    commitWork(): Promise<void>;
    rollbackWork(): Promise<void>;
    reset(): void;
    close(): void;
    end(): void;
}

export declare class KnDBConnections {
    static getDBConnector(configure?: (string | KnDBConfig)): KnDBConnector;
}
export declare function getDBConnector(section: string): KnDBConnector;

export declare class KnDBError extends Error {
    /**
     * this is error code
     */
    readonly code: number;
    /**
     * this is error state
     */
    readonly state?: string;
    constructor(message: string, code: number, state?: string);
}

export declare class KnDBUtils {
    static parseDBTypes(type: string | KnDBTypes): KnDBTypes;
    static parseDBAlias(alias: (string | KnDBAlias)): KnDBAlias;
    static parseDBDialect(dialect: (string | KnDBDialect)): KnDBDialect;
    static parseSQLOptions(query: string | KnSQLOptions): KnSQLOptions | undefined;
    static parseParamValue(param: KnDBValue): any;
    static getQuery(query: string | KnSQLOptions): string;
    static extractDBParam(params?: KnDBParam): [any, string[], string[]];
    static isSQLInterface(element: unknown): element is KnSQLInterface;
    static isMYSQL(config: KnDBConfig): boolean;
    static isDB2(config: KnDBConfig): boolean;
    static isMSSQL(config: KnDBConfig): boolean;
    static isINFORMIX(config: KnDBConfig): boolean;
    static isORACLE(config: KnDBConfig): boolean;
    static isPOSTGRES(config: KnDBConfig): boolean;
    static isSQLITE(config: KnDBConfig): boolean;
}

export declare class KnSQL implements KnSQLInterface {
    sql: string;
    options?: any;
    readonly params: Map<string, KnDBValue>;
    constructor(sql?: string, options?: any);
    clear(): void;
    clearParameter(): void;
    append(sql: string): KnSQL;
    set(paramname: string, paramvalue: (string | number | boolean | bigint | null | undefined | Date | Buffer | KnDBParamValue), paramtype?: (KnDBTypes | KnEnumDBTypes)): KnSQL;
    param(name: string): KnDBValue;
    getExactlySql(alias?: (string | KnDBAlias)): [string, string[]];
    parameters(names: string[]): any;
    getDBParam(names: string[]): KnDBParam;
    getSQLOptions(db: KnDBConnector): [KnSQLOptions, KnDBParam];
    executeQuery(db: KnDBConnector, ctx?: any): Promise<KnResultSet>;
    executeUpdate(db: KnDBConnector, ctx?: any): Promise<KnResultSet>;
    createSpan(db: KnDBConnector, ctx?: any): any;
}
