import { Connection } from 'mysql2';
import { MySQLDBQuery } from "./MySQLDBQuery";
import { MySQLDBConnection } from "./MySQLDBConnection";
import { DBParam, ResultSet, SQLOptions } from "../DBAlias";
import { DBConnect } from "../DBConnect";
import { DBConfig } from '../DBConfig';

class MySQLDB extends DBConnect {
    protected connector : MySQLDBConnection;
    public connection? : Connection;

    constructor(config: DBConfig,connection?: Connection) {
        super("MYSQL2","mysql",config);
        this.connector = new MySQLDBConnection(config);
        this.connection = connection;
    }

    protected async initConnection() {
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

    protected override async doExecuteQuery(sql: string | SQLOptions, params?: DBParam) : Promise<ResultSet> {
        await this.initConnection();
        return await MySQLDBQuery.executeQuery(this.connection as Connection,sql, params);
    }        

    protected async doExecuteUpdate(sql: string | SQLOptions, params?: DBParam) : Promise<ResultSet> {
        await this.initConnection();
        return await MySQLDBQuery.executeUpdate(this.connection as Connection,sql, params);
    }

    public override async beginWork() : Promise<void> {
        await this.initConnection();
        return await MySQLDBQuery.beginWork(this.connection as Connection);
    }

    public override async commitWork() : Promise<void> {
        await this.initConnection();
        return await MySQLDBQuery.commitWork(this.connection as Connection);
    }

    public override async rollbackWork() : Promise<void> {
        await this.initConnection();
        return await MySQLDBQuery.rollbackWork(this.connection as Connection);
    }

    public override close() : void {
        if(this.connection) {
            MySQLDBConnection.releaseConnection(this.connection);
        }
    }
    
    public override end() : void {
        MySQLDBConnection.releasePool();
    }
}

export = MySQLDB;
