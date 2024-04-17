import { SQLiteDBQuery } from "./SQLiteDBQuery";
import { SQLiteDBConnection } from "./SQLiteDBConnection";
import { KnDBParam, KnResultSet, KnSQLOptions } from "../KnDBAlias";
import { KnDBConnect } from "../KnDBConnect";
import { KnDBConfig } from "../KnDBConfig";
import { Database } from "sqlite3";

class SQLiteDB extends KnDBConnect {
    protected connector : SQLiteDBConnection;
    public connection? : Database;

    constructor(config: KnDBConfig,connection?: any) {
        super("SQLITE","sqlite",config);
        this.connector = new SQLiteDBConnection(config);
        this.connection = connection;
    }

    protected async initConnection() {
        if(this.connection==undefined || this.connection==null) {
            this.connection = this.connector.getConnection();
        }
    }

    public override async init() {
        this.initConnection();
    }

    public override reset() : void {
        this.connection = undefined;
    }

    protected override async doExecuteQuery(sql: string | KnSQLOptions, params?: KnDBParam) : Promise<KnResultSet> {
        await this.initConnection();
        return await SQLiteDBQuery.executeQuery(this.connection as Database,sql, params);
    }        

    protected override async doExecuteUpdate(sql: string | KnSQLOptions, params?: KnDBParam) : Promise<KnResultSet> {
        await this.initConnection();
        return await SQLiteDBQuery.executeUpdate(this.connection as Database,sql, params);
    }

    public override async beginWork() : Promise<void> {
        await this.initConnection();
        return await SQLiteDBQuery.beginWork(this.connection as Database);
    }

    public override async commitWork() : Promise<void> {
        await this.initConnection();
        return await SQLiteDBQuery.commitWork(this.connection as Database);
    }

    public override async rollbackWork() : Promise<void> {
        await this.initConnection();
        return await SQLiteDBQuery.rollbackWork(this.connection as Database);
    }

    public override close() : void {
        if(this.connection) {
            SQLiteDBConnection.releaseConnection(this.connection);
            this.connector.remove();
        }
        this.reset();
    }
    
    public override end() : void {
        SQLiteDBConnection.releasePool();
    }
    
}

export = SQLiteDB;
