import mysql from 'mysql';
import { Connection, Pool, PoolConnection, MysqlError } from 'mysql';
import { dbconfig } from "../DBConfig";

export class MySQLDBConnection {
    static pool: Pool;

    private static initPool() {
        if(!this.pool) {
            this.pool = mysql.createPool(dbconfig.url);
        }
    }
        
    public static getConnection() : Promise<Connection> {
        this.initPool();
        return new Promise<Connection>((resolve, reject) => {
            this.pool.getConnection((cerr: MysqlError, conn: Connection) => {
                if(cerr) {
                    if(conn) MySQLDBConnection.releaseConnection(conn);
                    reject(cerr);
                } else {
                    resolve(conn);
                }
            });
        });
    }
    
    public static getConnectionAsync(callback: Function) {
        this.initPool();
        this.pool.getConnection((cerr: MysqlError, conn: Connection) => {
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
            pconn.release(); 
        } catch(ex) { 
            console.error(ex);
        }
    }
    
    public static releasePool() {
        if(this.pool) {
            this.pool.end((err: any) => {
                //if(err) console.error(err);
            });
        }
    }

}
