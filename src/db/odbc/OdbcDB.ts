import { OdbcDBQuery } from "./OdbcDBQuery";
import { OdbcDBConnection } from "./OdbcDBConnection";
import { DBParam, ResultSet, SQLOptions } from "../DBAlias";
import { DBConnect } from "../DBConnect";
import { DBConfig } from "../DBConfig";

class OdbcDB extends DBConnect {
    public connection? : any;

    constructor(dialect?: string,config?: DBConfig,connection?: any) {
        super("ODBC",dialect,config);
        this.connection = connection;
    }

    private async initConnection() {
        if(this.connection==undefined || this.connection==null) {
            this.connection = await OdbcDBConnection.getConnection();
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
        return await OdbcDBQuery.executeQuery(this.connection,sql, params);
    }        

    public async executeUpdate(sql: string | SQLOptions, params?: DBParam) : Promise<ResultSet> {
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
