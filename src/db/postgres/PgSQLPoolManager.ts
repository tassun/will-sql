import { Pool } from 'pg';
import { KnDBConfig } from "../KnDBConfig";

export class PgSQLPoolManager {
    public static readonly pools = new Map<string,Pool>();
    public static getPool(dbcfg: KnDBConfig) : Pool {
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
        poolary.forEach(pool => {
            pool.end(() => { });
        });
        this.pools.clear();
    }
}