import { OdbcDBQuery } from "./OdbcDBQuery";
import { OdbcDBConnection } from "./OdbcDBConnection";
import { KnDBParam, KnResultSet, KnSQLOptions } from "../KnDBAlias";
import { KnDBConnect } from "../KnDBConnect";
import { KnDBConfig } from "../KnDBConfig";

class OdbcDB extends KnDBConnect {
    protected connector : OdbcDBConnection;
    public connection? : any;

    constructor(dialect: string,config: KnDBConfig,connection?: any) {
        super("ODBC",dialect,config);
        this.connector = new OdbcDBConnection(config);
        this.connection = connection;
    }

    protected async initConnection() {
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
        return await OdbcDBQuery.executeQuery(this.connection,sql, params);
    }        

    protected override async doExecuteUpdate(sql: string | KnSQLOptions, params?: KnDBParam | Array<any>) : Promise<KnResultSet> {
        await this.initConnection();
        return await OdbcDBQuery.executeUpdate(this.connection,sql, params);
    }

    public override async beginWork() : Promise<void> {
        await this.initConnection();
        return await OdbcDBQuery.beginWork(this.connection);
    }

    public override async commitWork() : Promise<void> {
        await this.initConnection();
        return await OdbcDBQuery.commitWork(this.connection);
    }

    public override async rollbackWork() : Promise<void> {
        await this.initConnection();
        return await OdbcDBQuery.rollbackWork(this.connection);
    }

    public override close() : void {
        if(this.connection) {
            OdbcDBConnection.releaseConnection(this.connection);
        }
    }
    
    public override end() : void {
        OdbcDBConnection.releasePool();
    }
    
}

export = OdbcDB;
