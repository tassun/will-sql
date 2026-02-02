import { Connection, Pool, PoolConnection } from 'mysql2';
import { KnDBConfig } from "../KnDBConfig";
import { MySQLPoolManager } from './MySQLPoolManager';

export class MySQLDBConnection {
    private readonly config: KnDBConfig;

    constructor(config: KnDBConfig) {
        this.config = config;
    }

    private getPool() : Pool {
        return MySQLPoolManager.getPool(this.config);
    }

    public getConnection() : Promise<Connection> {
        let pool = this.getPool();
        return new Promise<Connection>((resolve, reject) => {
            pool.getConnection((cerr: any, conn: Connection) => {
                if(cerr) {
                    if(conn) MySQLDBConnection.releaseConnection(conn);
                    reject(cerr);
                } else {
                    resolve(conn);
                }
            });
        });
    }
    
    public getConnectionAsync(callback: Function) {
        let pool = this.getPool();
        pool.getConnection((cerr: any, conn: Connection) => {
            if(cerr) {
                if(conn) MySQLDBConnection.releaseConnection(conn);
                callback(cerr, null);
            } else {
                callback(null, conn);
            }
        });
    }
    
    public static releaseConnection(conn: Connection) {
        try {
            let pconn : PoolConnection = conn as PoolConnection;
            pconn.destroy();
        } catch(ex) { 
            console.error(ex);
        }
    }
    
    public static releasePool() {
        MySQLPoolManager.destroy();
    }

}
