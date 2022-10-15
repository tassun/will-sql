import { dbconfig } from "../DBConfig";
const odbc = require("odbc");

export class OdbcDBConnection {
    static pool: any;

    private static async initPool() {
        if(!this.pool) {
            this.pool = await odbc.pool(dbconfig.url);
        }
    }
        
    public static async getConnection() : Promise<any> {
        await this.initPool();
        return await this.pool.connect();
    }
    
    public static async getConnectionAsync(callback: Function) {
        await this.initPool();
        this.pool.connect((cerr: any, conn: any) => {
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
        if(this.pool) {
            this.pool.close((err: any) => {
                //if(err) console.error(err);
            });
        }
    }

}
