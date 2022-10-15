import { Request, Transaction } from 'mssql';
import { MsSQLDBQuery } from "./MsSQLDBQuery";
import { MsSQLDBConnection } from "./MsSQLDBConnection";
import { DBParam, ResultSet, SQLOptions } from "../DBAlias";
import { DBConnect } from "../DBConnect";
import { DBConfig } from '../DBConfig';

class MsSQLDB extends DBConnect {
    public connection? : Request;
    public transaction? : Transaction;

    constructor(config?: DBConfig,connection?: Request) {
        super("MSSQL","mssql",config);
        this.connection = connection;
    }

    private async initConnection() {
        if(this.connection==undefined || this.connection==null) {
            this.connection = await MsSQLDBConnection.getConnection(this.transaction);
        }
    }

    public override async init() {
        await this.initConnection();
    }

    public override reset() : void {
        this.connection = undefined;
        this.transaction = undefined;
    }

    public override async executeQuery(sql: string | SQLOptions, params?: DBParam) : Promise<ResultSet> {
        await this.initConnection();
        return await MsSQLDBQuery.executeQuery(this.connection as Request,sql, params);
    }        

    public async executeUpdate(sql: string | SQLOptions, params?: DBParam) : Promise<ResultSet> {
        await this.initConnection();
        return await MsSQLDBQuery.executeUpdate(this.connection as Request,sql, params);
    }

    public override async beginWork() : Promise<void> {
        this.reset();
        this.transaction = await MsSQLDBConnection.getTransaction();
        await this.initConnection();
        return await MsSQLDBQuery.beginWork(this.connection as Request);
    }

    public override async commitWork() : Promise<void> {
        await this.initConnection();
        try {
            return await MsSQLDBQuery.commitWork(this.connection as Request);
        } finally {
            this.reset();
        }
    }

    public override async rollbackWork() : Promise<void> {
        await this.initConnection();
        try {
            return await MsSQLDBQuery.rollbackWork(this.connection as Request);
        } finally {
            this.reset();
        }
    }

    public override close() : void {
        if(this.connection) {
            MsSQLDBConnection.releaseConnection();
        }
    }
    
    public override end() : void {
        MsSQLDBConnection.releasePool();
    }
}

export = MsSQLDB;
