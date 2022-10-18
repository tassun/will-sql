import { DBUtils } from "./DBUtils";
import { DBConnector, DBAlias, DBParam, SQLOptions, ResultSet } from "./DBAlias";
import { DBConfig } from "./DBConfig";

type EnumDBAlias = keyof typeof DBAlias;

export abstract class DBConnect implements DBConnector {
    public readonly alias: DBAlias;
    public readonly dialect: string;
    public readonly config: DBConfig;

    constructor(alias: (DBAlias | EnumDBAlias), dialect: string, config: DBConfig) {
        this.alias = DBUtils.parseDBAlias(alias);
        this.dialect = dialect;
        this.config = config;
    }

    public async init() {
        //do nothing
    }

    public async executeQuery(sql: string | SQLOptions, params?: DBParam) : Promise<ResultSet> {
        return Promise.reject(null);
    }

    public async executeUpdate(sql: string| SQLOptions, params?: DBParam) : Promise<ResultSet> {
        return Promise.reject(null);
    }

    public async beginWork() : Promise<void> {
        return Promise.reject();
    }

    public async commitWork() : Promise<void> {
        return Promise.reject();
    }

    public async rollbackWork() : Promise<void> {
        return Promise.reject();
    }

    public reset() : void {
        //do nothing
    }

    /* close connection */
    public close() : void {
        //do nothing
    }
    
    /* end pool */
    public end() : void {
        //do nothing
    }
}
