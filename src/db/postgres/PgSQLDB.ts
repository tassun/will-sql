import { PoolClient } from 'pg';
import { PgSQLDBQuery } from "./PgSQLDBQuery";
import { PgSQLDBConnection } from "./PgSQLDBConnection";
import { DBParam, ResultSet, SQLOptions } from "../DBAlias";
import { DBConnect } from "../DBConnect";
import { DBConfig } from '../DBConfig';

class PgSQLDB extends DBConnect {
    protected connector: PgSQLDBConnection;
    public connection? : PoolClient;

    constructor(config: DBConfig,connection?: PoolClient) {
        super("POSTGRES","postgres",config);
        this.connector = new PgSQLDBConnection(config);
        this.connection = connection;
    }

    private async initConnection() {
        if(this.connection==undefined || this.connection==null) {
            this.connection = await this.connector.getConnection();
        }
    }

    public override async init() {
        await this.initConnection();
    }

    public override reset() : void {
        this.connection = undefined;
    }

    public override async executeQuery(sql: string | SQLOptions, params?: DBParam) : Promise<ResultSet> {
        await this.initConnection();
        return await PgSQLDBQuery.executeQuery(this.connection as PoolClient,sql, params);
    }        

    public async executeUpdate(sql: string | SQLOptions, params?: DBParam) : Promise<ResultSet> {
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
