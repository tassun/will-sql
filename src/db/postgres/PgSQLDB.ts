import { PoolClient } from 'pg';
import { PgSQLDBQuery } from "./PgSQLDBQuery";
import { PgSQLDBConnection } from "./PgSQLDBConnection";
import { KnDBParam, KnResultSet, KnSQLOptions } from "../KnDBAlias";
import { KnDBConnect } from "../KnDBConnect";
import { KnDBConfig } from '../KnDBConfig';

class PgSQLDB extends KnDBConnect {
    protected connector: PgSQLDBConnection;
    public connection? : PoolClient;

    constructor(config: KnDBConfig,connection?: PoolClient) {
        super("POSTGRES","postgres",config);
        this.connector = new PgSQLDBConnection(config);
        this.connection = connection;
    }

    private async initConnection() {
        if(!this.connection) {
            this.connection = await this.connector.getConnection();
        }
    }

    public override async init() {
        await this.initConnection();
    }

    public override async getConnection() : Promise<any> {
        await this.initConnection();
        return this.connection;
    }

    public override reset() : void {
        this.connection = undefined;
    }

    protected override async doExecuteQuery(sql: string | KnSQLOptions, params?: KnDBParam | Array<any>) : Promise<KnResultSet> {
        await this.initConnection();
        return await PgSQLDBQuery.executeQuery(this.connection as PoolClient,sql, params);
    }        

    protected override async doExecuteUpdate(sql: string | KnSQLOptions, params?: KnDBParam | Array<any>) : Promise<KnResultSet> {
        await this.initConnection();
        return await PgSQLDBQuery.executeUpdate(this.connection as PoolClient,sql, params);
    }

    public override async beginWork() : Promise<void> {
        await this.initConnection();
        return await PgSQLDBQuery.beginWork(this.connection as PoolClient);
    }

    public override async commitWork() : Promise<void> {
        await this.initConnection();
        return await PgSQLDBQuery.commitWork(this.connection as PoolClient);
    }

    public override async rollbackWork() : Promise<void> {
        await this.initConnection();
        return await PgSQLDBQuery.rollbackWork(this.connection as PoolClient);
    }

    public override close() : void {
        if(this.connection) {
            PgSQLDBConnection.releaseConnection(this.connection);
        }
    }
    
    public override end() : void {
        PgSQLDBConnection.releasePool();
    }
}

export = PgSQLDB;
