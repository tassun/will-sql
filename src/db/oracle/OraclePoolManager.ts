import oracledb, { Pool, DBError } from 'oracledb';
import { KnDBConfig } from "../KnDBConfig";

export class OraclePoolManager {
    public static readonly pools = new Map<string,Pool>();
    public static async getPool(dbcfg: KnDBConfig) : Promise<Pool> {
        let pool = this.pools.get(dbcfg.schema);
        if(!pool) {
            pool = await oracledb.createPool({
                user: dbcfg.user,
                password: dbcfg.password,
                connectionString: dbcfg.url,
                ...dbcfg.options
            });
            this.pools.set(dbcfg.schema,pool);
        }    
        return pool;
    }
    public static remove(schema: string) : void {
        let pool = this.pools.get(schema);
        if(pool) {
            pool.close((err: DBError) => {

            });
            this.pools.delete(schema);
        }
    }
    public static destroy() : void {
        let poolary = Array.from(this.pools.values());
        Promise.all(poolary.map((pool: Pool) => {
                return pool.close((err: DBError) => {

                });
            }
        ));
        this.pools.clear();
    }    
}