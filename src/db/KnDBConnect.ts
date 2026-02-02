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

    public async init() : Promise<void> {
        //do nothing
    }

    public async getConnection() : Promise<any> {
        throw new Error("Not implementation");
    }

    protected async doExecuteQuery(sql: string | KnSQLOptions, params?: KnDBParam | Array<any>) : Promise<KnResultSet> {
        throw new Error("Not implementation");
    }

    protected async doExecuteUpdate(sql: string| KnSQLOptions, params?: KnDBParam | Array<any>) : Promise<KnResultSet> {
        throw new Error("Not implementation");
    }

    public async executeQuery(sql: string | KnSQLOptions, params?: KnDBParam | Array<any>, ctx?: any) : Promise<KnResultSet> {
        if(KnDBUtils.isSQLInterface(sql)) {
            return this.execQuery(sql as KnSQLInterface, ctx);
        }
        return this.doExecuteQuery(sql, params);
    }

    public async executeUpdate(sql: string| KnSQLOptions, params?: KnDBParam | Array<any>, ctx?: any) : Promise<KnResultSet> {
        if(KnDBUtils.isSQLInterface(sql)) {
            return this.execUpdate(sql as KnSQLInterface);
        }
        return this.doExecuteUpdate(sql, params);
    }

    public async execQuery(sql: KnSQLInterface, ctx?: any) : Promise<KnResultSet> {
        return sql.executeQuery(this,ctx);
    }

    public async execUpdate(sql: KnSQLInterface, ctx?: any) : Promise<KnResultSet> {
        return sql.executeUpdate(this,ctx);
    }

    public async beginWork() : Promise<void> {
        throw new Error("Not implementation");
    }

    public async commitWork() : Promise<void> {
        throw new Error("Not implementation");
    }

    public async rollbackWork() : Promise<void> {
        throw new Error("Not implementation");
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
