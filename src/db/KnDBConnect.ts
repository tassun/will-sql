import { KnDBUtils } from "./KnDBUtils";
import { KnDBConnector, KnDBAlias, KnDBParam, KnSQLOptions, KnResultSet, KnSQLInterface } from "./KnDBAlias";
import { KnDBConfig } from "./KnDBConfig";

export type KnEnumDBAlias = keyof typeof KnDBAlias;

export abstract class KnDBConnect implements KnDBConnector {
    public readonly alias: KnDBAlias;
    public readonly dialect: string;
    public readonly config: KnDBConfig;

    constructor(alias: (KnDBAlias | KnEnumDBAlias), dialect: string, config: KnDBConfig) {
        this.alias = KnDBUtils.parseDBAlias(alias);
        this.dialect = dialect;
        this.config = config;
    }

    public async init() {
        //do nothing
    }

    protected async doExecuteQuery(sql: string | KnSQLOptions, params?: KnDBParam) : Promise<KnResultSet> {
        return Promise.reject(null);
    }

    protected async doExecuteUpdate(sql: string| KnSQLOptions, params?: KnDBParam) : Promise<KnResultSet> {
        return Promise.reject(null);
    }

    public async executeQuery(sql: string | KnSQLOptions, params?: KnDBParam) : Promise<KnResultSet> {
        if(KnDBUtils.isSQLInterface(sql)) {
            return this.execQuery(sql as KnSQLInterface);
        }
        return this.doExecuteQuery(sql, params);
    }

    public async executeUpdate(sql: string| KnSQLOptions, params?: KnDBParam) : Promise<KnResultSet> {
        if(KnDBUtils.isSQLInterface(sql)) {
            return this.execUpdate(sql as KnSQLInterface);
        }
        return this.doExecuteUpdate(sql, params);
    }

    public async execQuery(sql: KnSQLInterface) : Promise<KnResultSet> {
        return sql.executeQuery(this);
    }

    public async execUpdate(sql: KnSQLInterface) : Promise<KnResultSet> {
        return sql.executeUpdate(this);
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
