import { Pool, PoolClient } from 'pg';
import { KnDBConfig } from "../KnDBConfig";
import { PgSQLPoolManager } from "./PgSQLPoolManager";

export class PgSQLDBConnection {
    private config: KnDBConfig;

    constructor(config: KnDBConfig) {
        this.config = config;
    }

    private getPool() : Pool {
        return PgSQLPoolManager.getPool(this.config);
    }
        
    public getConnection() : Promise<PoolClient> {
        let pool = this.getPool();
        return new Promise<PoolClient>((resolve, reject) => {
            pool.connect((cerr: any, conn: PoolClient) => {
                if(cerr) {
                    if(conn) PgSQLDBConnection.releaseConnection(conn);
                    reject(cerr);
                } else {
                    resolve(conn);
                }
            });
        });
    }
    
    public getConnectionAsync(callback: Function) {
        let pool = this.getPool();
        pool.connect((cerr: any, conn: PoolClient) => {
            if(cerr) {
                if(conn) PgSQLDBConnection.releaseConnection(conn);
                callback(cerr, null);
            } else {
                callback(null, conn);
            }
        });
    }
    
    public static releaseConnection(conn: PoolClient) {
        try {
            conn.release(); 
        } catch(ex) { 
            console.error(ex);
        }
    }
    
    public static releasePool() {
        PgSQLPoolManager.destroy();
    }

}
