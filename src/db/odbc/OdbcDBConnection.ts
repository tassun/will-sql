import { KnDBConfig } from "../KnDBConfig";
import { OdbcPoolManager } from "./OdbcPoolManager";

export class OdbcDBConnection {
    private readonly config: KnDBConfig;

    constructor(config: KnDBConfig) {
        this.config = config;
    }

    private async getPool() : Promise<any> {
        return await OdbcPoolManager.getPool(this.config);
    }
        
    public async getConnection() : Promise<any> {
        let pool = await this.getPool();
        return await pool.connect();
    }
    
    public async getConnectionAsync(callback: Function) {
        let pool = await this.getPool();
        pool.connect((cerr: any, conn: any) => {
            if(cerr) {
                callback(cerr, null);
            } else {
                callback(null, conn);
            }
        });
    }
    
    public static releaseConnection(conn?: any) {
        if(conn) {
            conn.close((err: any) => {
                if(err) console.error(err);
            });
        }
    }
    
    public static releasePool() {
        OdbcPoolManager.destroy();
    }

}
