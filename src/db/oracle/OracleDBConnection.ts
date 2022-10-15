import oracledb from 'oracledb';
import { Connection, Pool, DBError } from 'oracledb';
import { dbconfig } from "../DBConfig";

export class OracleDBConnection {
    static pool: Pool;

    private static async initPool() {
        if(!this.pool) {
            this.pool = await oracledb.createPool({
                user: dbconfig.user,
                password: dbconfig.password,
                connectionString: dbconfig.url
            });
        }
    }
        
    public static async getConnection() : Promise<Connection> {
        await this.initPool();
        return new Promise<Connection>((resolve, reject) => {
            this.pool.getConnection((cerr: DBError, conn: Connection) => {
                if(cerr) {
                    if(conn) OracleDBConnection.releaseConnection(conn);
                    reject(cerr);
                } else {
                    resolve(conn);
                }
            });
        });
    }
        
    public static releaseConnection(conn: Connection) {
        try {
            conn.close((cerr: DBError) => {
                if(cerr) console.error("error",cerr);
            });
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
