declare enum DBAlias {
    MYSQL = "MYSQL",
    MSSQL = "MSSQL",
    ODBC = "ODBC",
    ORACLE = "ORACLE",
    POSTGRES = "POSTGRES",
    SQLITE = "SQLITE",
    MYSQL2 = "MYSQL2"
}
declare enum DBDialect {
    MYSQL = "mysql",
    MSSQL = "mssql",
    ORACLE = "oracle",
    POSTGRES = "postgres",
    INFORMIX = "informix",
    DB2 = "db2",
    SQLITE = "sqlite"
}
declare enum DBTypes {
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
declare type EnumDBTypes = keyof typeof DBTypes;
interface DBValue {
    value: (string | number | boolean | bigint | null | undefined | Date | Buffer);
    type: (DBTypes | EnumDBTypes);
}
interface DBParam {
    [name: string]: DBValue;
}
declare class DBParamValue implements DBValue {
    value: (string | number | boolean | bigint | null | undefined | Date | Buffer);
    type: (DBTypes | EnumDBTypes);
    constructor(value: (string | number | boolean | bigint | null | undefined | Date | Buffer), type?: (DBTypes | EnumDBTypes));
}
interface DBConnector {
    readonly alias: DBAlias;
    readonly dialect: string;
    readonly config: DBConfig;
    init(): void;
    executeQuery(sql: string | SQLOptions, params?: DBParam): Promise<ResultSet>;
    executeUpdate(sql: string | SQLOptions, params?: DBParam): Promise<ResultSet>;
    execQuery(sql: SQLInterface): Promise<ResultSet>;
    execUpdate(sql: SQLInterface): Promise<ResultSet>;
    beginWork(): Promise<void>;
    commitWork(): Promise<void>;
    rollbackWork(): Promise<void>;
    reset(): void;
    close(): void;
    end(): void;
}
interface PageOffset {
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
interface ResultSet {
    rows: any;
    columns: any;
    offsets?: PageOffset;
}
interface RecordSet extends ResultSet {
    records: number;
}
interface SQLOptions {
    sql: string;
    options?: any;
}
interface SQLInterface {
    params: Map<string, DBValue>;
    clear(): void;
    clearParameter(): void;
    append(sql: string): SQLInterface;
    set(paramname: string, paramvalue: (string | number | boolean | bigint | null | undefined | Date | Buffer | DBParamValue), paramtype?: (DBTypes | EnumDBTypes)): SQLInterface;
    param(name: string): DBValue;
    executeQuery(db: DBConnector, ctx?: any): Promise<ResultSet>;
    executeUpdate(db: DBConnector, ctx?: any): Promise<ResultSet>;
    getSQLOptions(db: DBConnector): [SQLOptions, DBParam];
}
export { DBAlias, DBDialect, DBTypes, DBValue, DBParam, DBParamValue, DBConnector, PageOffset, ResultSet, RecordSet, SQLOptions, SQLInterface };

export interface DBConfig {
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
export declare const dbconfig: DBConfig;

export declare class DBError extends Error {
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

export declare class DBUtils {
    static parseDBTypes(type: string | DBTypes): DBTypes;
    static parseDBAlias(alias: (string | DBAlias)): DBAlias;
    static parseDBDialect(dialect: (string | DBDialect)): DBDialect;
    static parseSQLOptions(query: string | SQLOptions): SQLOptions | undefined;
    static parseParamValue(param: DBValue): any;
    static getQuery(query: string | SQLOptions): string;
    static extractDBParam(params?: DBParam): [any, string[], string[]];
    static isSQLInterface(element: unknown): element is SQLInterface;
    static isMYSQL(config: DBConfig): boolean;
    static isDB2(config: DBConfig): boolean;
    static isMSSQL(config: DBConfig): boolean;
    static isINFORMIX(config: DBConfig): boolean;
    static isORACLE(config: DBConfig): boolean;
    static isPOSTGRES(config: DBConfig): boolean;
    static isSQLITE(config: DBConfig): boolean;
}

declare type EnumDBAlias = keyof typeof DBAlias;
export declare abstract class DBConnect implements DBConnector {
    readonly alias: DBAlias;
    readonly dialect: string;
    readonly config: DBConfig;
    constructor(alias: (DBAlias | EnumDBAlias), dialect: string, config: DBConfig);
    init(): Promise<void>;
    protected doExecuteQuery(sql: string | SQLOptions, params?: DBParam): Promise<ResultSet>;
    protected doExecuteUpdate(sql: string | SQLOptions, params?: DBParam): Promise<ResultSet>;
    executeQuery(sql: string | SQLOptions, params?: DBParam): Promise<ResultSet>;
    executeUpdate(sql: string | SQLOptions, params?: DBParam): Promise<ResultSet>;
    execQuery(sql: SQLInterface): Promise<ResultSet>;
    execUpdate(sql: SQLInterface): Promise<ResultSet>;
    beginWork(): Promise<void>;
    commitWork(): Promise<void>;
    rollbackWork(): Promise<void>;
    reset(): void;
    close(): void;
    end(): void;
}

export declare class DBConnections {
    static getDBConnector(configure?: (string | DBConfig)): DBConnector;
}
export declare function getDBConnector(section: string): DBConnector;

declare type EnumDBTypes = keyof typeof DBTypes;
export declare class KnSQL implements SQLInterface {
    sql: string;
    options?: any;
    readonly params: Map<string, DBValue>;
    constructor(sql?: string, options?: any);
    clear(): void;
    clearParameter(): void;
    append(sql: string): KnSQL;
    set(paramname: string, paramvalue: (string | number | boolean | bigint | null | undefined | Date | Buffer | DBParamValue), paramtype?: (DBTypes | EnumDBTypes)): KnSQL;
    param(name: string): DBValue;
    getExactlySql(alias?: (string | DBAlias)): [string, string[]];
    parameters(names: string[]): any;
    getDBParam(names: string[]): DBParam;
    getSQLOptions(db: DBConnector): [SQLOptions, DBParam];
    executeQuery(db: DBConnector, ctx?: any): Promise<ResultSet>;
    executeUpdate(db: DBConnector, ctx?: any): Promise<ResultSet>;
    createSpan(db: DBConnector, ctx?: any): any;
}
