declare enum DBAlias {
    MYSQL = "MYSQL",
    MSSQL = "MSSQL",
    ODBC = "ODBC",
    ORACLE = "ORACLE",
    POSTGRES = "POSTGRES"
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
interface ResultSet {
    rows: any;
    columns: any;
}
interface SQLOptions {
    sql: string;
    options?: any;
}
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
    readonly dialect?: string;
    readonly config?: DBConfig;
    init(): void;
    executeQuery(sql: string | SQLOptions, params?: DBParam): Promise<ResultSet>;
    executeUpdate(sql: string | SQLOptions, params?: DBParam): Promise<ResultSet>;
    beginWork(): Promise<void>;
    commitWork(): Promise<void>;
    rollbackWork(): Promise<void>;
    reset(): void;
    close(): void;
    end(): void;
}
export { DBAlias, ResultSet, DBValue, DBParam, DBParamValue, DBTypes, SQLOptions, DBConnector };

export interface DBConfig {
    alias: string;
    dialect: string;
    url: string;
    user: string;
    password: string;
    options?: any;
}
export declare const dbconfig: DBConfig;

export declare class DBError extends Error {
    readonly state: number;
    constructor(message: string, state: number);
}

export declare class DBUtils {
    static parseDBTypes(type: string | DBTypes): DBTypes;
    static parseDBAlias(alias: (string | DBAlias)): DBAlias;
    static parseSQLOptions(query: string | SQLOptions): SQLOptions | undefined;
    static getQuery(query: string | SQLOptions): string;
    static extractDBParam(params?: DBParam): [any, string[], string[]];
}

declare type EnumDBAlias = keyof typeof DBAlias;
export declare abstract class DBConnect implements DBConnector {
    readonly alias: DBAlias;
    readonly dialect?: string;
    readonly config?: DBConfig;
    constructor(alias: (DBAlias | EnumDBAlias), dialect?: string, config?: DBConfig);
    init(): Promise<void>;
    executeQuery(sql: string | SQLOptions, params?: DBParam): Promise<ResultSet>;
    executeUpdate(sql: string | SQLOptions, params?: DBParam): Promise<ResultSet>;
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
export declare class KnSQL {
    sql: string;
    options?: any;
    readonly params: Map<string, DBValue>;
    constructor(sql?: string, options?: any);
    clear(): void;
    append(sql: string): KnSQL;
    set(paramname: string, paramvalue: (string | number | boolean | bigint | null | undefined | Date | Buffer | DBParamValue), paramtype?: (DBTypes | EnumDBTypes)): KnSQL;
    param(name: string): DBValue;
    getExactlySql(alias?: (string | DBAlias)): [string, string[]];
    parameters(names: string[]): any;
    getDBParam(names: string[]): DBParam;
    executeQuery(db: DBConnector): Promise<ResultSet>;
    executeUpdate(db: DBConnector): Promise<ResultSet>;
}

export declare class Iterator<T> {
    private values;
    private index;
    constructor(values: T[]);
    hasNext(): boolean;
    next(): T;
}

export declare class StringTokenizer {
    private text;
    private separator;
    private returnSeparator;
    constructor(text: string, separator?: string, returnSeparator?: boolean);
    private indexOf;
    tokenize(): string[];
    iterator(): Iterator<string>;
}

export declare class Utilities {
    static getWorkingDir(dir: string): string;
    static getDateNow(now?: Date): string;
    static getTimeNow(now?: Date): string;
    static getDateTimeNow(now?: Date): string;
    static getYMD(now?: Date): string;
    static getDMY(now?: Date): string;
    static formatDate(now?: Date, ymd?: boolean): string;
    static getHMS(now?: Date): string;
    static currentDate(now?: Date): string;
    static currentTime(now?: Date): string;
    static currentDateTime(now?: Date): string;
    static currentTimeMillis(now?: Date): number;
    static addDays(days: number, date?: Date): Date;
    static compareDate(adate?: Date, bdate?: Date): number;
    static compareString(astr?: string, bstr?: string): number;
    static equalsIgnoreCase(astr?: string, bstr?: string): boolean;
    static isString(value: any): boolean;
    static parseNumber(defaultValue: number, dataValue?: any): number;
}
