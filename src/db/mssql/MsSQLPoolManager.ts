import mssql from 'mssql';
import { ConnectionPool } from 'mssql';
import { KnDBConfig } from "../KnDBConfig";

export class MsSQLPoolManager {
    public static pools = new Map<string,ConnectionPool>();
    public static async getPool(dbcfg: KnDBConfig) : Promise<ConnectionPool> {
        let pool = this.pools.get(dbcfg.schema);
        if(!pool) {
            let appool = new mssql.ConnectionPool(dbcfg.url);
            pool = await appool.connect();
            this.pools.set(dbcfg.schema,pool);
        }    
        return pool;
    }
    public static remove(schema: string) : void {
        let pool = this.pools.get(schema);
        if(pool) {
            pool.close((err: any) => {

            });
            this.pools.delete(schema);
        }
    }
    public static destroy() : void {
        let poolary = Array.from(this.pools.values());
        Promise.all(poolary.map((pool: ConnectionPool) => {
                return pool.close((err: any) => {

                });
            }
        ));
        this.pools.clear();
    }

}