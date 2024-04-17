import { Connection } from 'oracledb';
import { OracleDBQuery } from "./OracleDBQuery";
import { OracleDBConnection } from "./OracleDBConnection";
import { KnDBParam, KnResultSet, KnSQLOptions } from "../KnDBAlias";
import { KnDBConnect } from "../KnDBConnect";
import { KnDBConfig } from '../KnDBConfig';

class OracleDB extends KnDBConnect {
    protected connector :  OracleDBConnection;
    public connection? : Connection;

    constructor(config: KnDBConfig,connection?: Connection) {
        super("ORACLE","oracle",config);
        this.connector = new OracleDBConnection(config);
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

    protected override async doExecuteQuery(sql: string | KnSQLOptions, params?: KnDBParam) : Promise<KnResultSet> {
        await this.initConnection();
        return await OracleDBQuery.executeQuery(this.connection as Connection,sql, params);
    }        

    protected override async doExecuteUpdate(sql: string | KnSQLOptions, params?: KnDBParam) : Promise<KnResultSet> {
        await this.initConnection();
        return await OracleDBQuery.executeUpdate(this.connection as Connection,sql, params);
    }

    public override async beginWork() : Promise<void> {
        await this.initConnection();
        return await OracleDBQuery.beginWork(this.connection as Connection);
    }

    public override async commitWork() : Promise<void> {
        await this.initConnection();
        return await OracleDBQuery.commitWork(this.connection as Connection);
    }

    public override async rollbackWork() : Promise<void> {
        await this.initConnection();
        return await OracleDBQuery.rollbackWork(this.connection as Connection);
    }

    public override close() : void {
        if(this.connection) {
            OracleDBConnection.releaseConnection(this.connection);
        }
    }
    
    public override end() : void {
        OracleDBConnection.releasePool();
    }
}

export = OracleDB;
