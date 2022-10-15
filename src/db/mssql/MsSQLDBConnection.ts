import mssql from 'mssql';
import { Request, ConnectionPool, Transaction } from 'mssql';
import { dbconfig } from "../DBConfig";

export class MsSQLDBConnection {
    private static pool?: ConnectionPool;

    private static async initPool() {
        if(!this.pool) {
            let appool = new mssql.ConnectionPool(dbconfig.url);
            this.pool = await appool.connect();
        }
    }
        
    public static async getConnection(transaction?: Transaction) : Promise<Request> {
        await this.initPool();
        if(transaction) {
            let request = transaction.request();
            request.transaction = transaction;
            return Promise.resolve(request);
        }
        return Promise.resolve((this.pool as ConnectionPool).request());
    }

    public static async getTransaction() : Promise<Transaction> {
        await this.initPool();
        return Promise.resolve((this.pool as ConnectionPool).transaction());
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
        if(this.pool) {
            this.pool.close((err: any) => {
                //if(err) console.error(err);
            });
        }
    }

}
