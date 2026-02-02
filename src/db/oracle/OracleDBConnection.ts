import { Connection, Pool, DBError } from 'oracledb';
import { KnDBConfig } from "../KnDBConfig";
import { OraclePoolManager } from './OraclePoolManager';

export class OracleDBConnection {
    private readonly config: KnDBConfig;

    constructor(config: KnDBConfig) {
        this.config = config;
    }

    private async getPool() : Promise<Pool> {
        return await OraclePoolManager.getPool(this.config);
    }

    public async getConnection() : Promise<Connection> {
        let pool = await this.getPool();
        return new Promise<Connection>((resolve, reject) => {
            pool.getConnection((cerr: DBError, conn: Connection) => {
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
        OraclePoolManager.destroy();
    }
    
}
