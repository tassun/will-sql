import { KnDBConfig } from "../KnDBConfig";
import { SQLitePoolManager } from "./SQLitePoolManager";
import { Database } from "sqlite3";

export class SQLiteDBConnection {
    private readonly config: KnDBConfig;

    constructor(config: KnDBConfig) {
        this.config = config;
    }

    private getPool() : Database {
        return SQLitePoolManager.getPool(this.config);
    }
        
    public getConnection() : Database {
        return this.getPool();
    }
    
    public getConnectionAsync(callback: Function) {
        let conn = this.getPool();
        callback(null, conn);
    }
    
    public remove() : void {
        SQLitePoolManager.remove(this.config.schema);
    }

    public static releaseConnection(conn?: Database) {
        if(conn) {
            conn.close((err: any) => {
                if(err) console.error(err);
            });
        }
    }
    
    public static releasePool() {
        SQLitePoolManager.destroy();
    }

}
