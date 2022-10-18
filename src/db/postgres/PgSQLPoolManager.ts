import { Pool } from 'pg';
import { DBConfig } from "../DBConfig";

export class PgSQLPoolManager {
    public static pools = new Map<string,Pool>();
    public static getPool(dbcfg: DBConfig) : Pool {
        let pool = this.pools.get(dbcfg.schema);
        if(!pool) {
            pool = new Pool({
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
            pool.end(() => {
            });
            this.pools.delete(schema);
        }
    }
    public static destroy() : void {
        let poolary = Array.from(this.pools.values());
        Promise.all(poolary.map((pool: Pool) => {
            pool.end(() => {
            });
            }
        ));
        this.pools.clear();
    }
}