import { Pool, PoolClient } from 'pg';
import { dbconfig } from "../DBConfig";

export class PgSQLDBConnection {
    static pool: Pool;

    private static initPool() {
        if(!this.pool) {
            this.pool = new Pool({
                connectionString: dbconfig.url,
            });
        }
    }
        
    public static getConnection() : Promise<PoolClient> {
        this.initPool();
        return new Promise<PoolClient>((resolve, reject) => {
            this.pool.connect((cerr: any, conn: PoolClient) => {
                if(cerr) {
                    if(conn) PgSQLDBConnection.releaseConnection(conn);
                    reject(cerr);
                } else {
                    resolve(conn);
                }
            });
        });
    }
    
    public static getConnectionAsync(callback: Function) {
        this.initPool();
        this.pool.connect((cerr: any, conn: PoolClient) => {
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
        if(this.pool) {
            this.pool.end(() => {
            });
        }
    }

}
