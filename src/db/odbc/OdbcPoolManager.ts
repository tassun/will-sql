import { KnDBConfig } from "../KnDBConfig";
const odbc = require("odbc");

export class OdbcPoolManager {
    public static pools = new Map<string,any>();
    public static async getPool(dbcfg: KnDBConfig) : Promise<any> {
        let pool = this.pools.get(dbcfg.schema);
        if(!pool) {
            pool = await odbc.pool(dbcfg.url);
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
        Promise.all(poolary.map((pool: any) => {
                return pool.close((err: any) => {

                });
            }
        ));
        this.pools.clear();
    }    
}