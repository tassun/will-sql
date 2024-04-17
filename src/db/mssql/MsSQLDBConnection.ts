import { Request, ConnectionPool, Transaction } from 'mssql';
import { KnDBConfig } from "../KnDBConfig";
import { MsSQLPoolManager } from './MsSQLPoolManager';

export class MsSQLDBConnection {
    private config: KnDBConfig;

    constructor(config: KnDBConfig) {
        this.config = config;
    }

    private async getPool() : Promise<ConnectionPool> {
        return await MsSQLPoolManager.getPool(this.config);
    }

    public async getConnection(transaction?: Transaction) : Promise<Request> {
        let pool = await this.getPool();
        if(transaction) {
            let request = transaction.request();
            request.transaction = transaction;
            return Promise.resolve(request);
        }
        return Promise.resolve(pool.request());
    }

    public async getTransaction() : Promise<Transaction> {
        let pool = await this.getPool();
        return Promise.resolve(pool.transaction());
    }
    
    public static releaseConnection(conn?: ConnectionPool) {
        try {
            if(conn) {
                conn.close((err: any) => { 
                    if(err) console.error(err);
                }); 
            }
        } catch(ex) { 
            console.error(ex);
        }
    }
    
    public static releasePool() {
        MsSQLPoolManager.destroy();
    }

}
