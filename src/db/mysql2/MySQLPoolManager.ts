import mysql from 'mysql2';
import { Pool } from 'mysql2';
import { DBConfig } from "../DBConfig";

export class MySQLPoolManager {
    public static pools = new Map<string,Pool>();
    public static getPool(dbcfg: DBConfig) : Pool {
        let pool = this.pools.get(dbcfg.schema);
        if(!pool) {
            pool = mysql.createPool({
                user: dbcfg.user,
                password: dbcfg.password,
                host: dbcfg.host,
                port: dbcfg.port,
                database: dbcfg.database,
                ...dbcfg.options
            });
            this.pools.set(dbcfg.schema,pool);
        }    
        return pool;
    }
    public static remove(schema: string) : void {
        let pool = this.pools.get(schema);
        if(pool) {
            pool.end((err: any) => {

            });
            this.pools.delete(schema);
        }
    }
    public static destroy() : void {
        let poolary = Array.from(this.pools.values());
        Promise.all(poolary.map((pool: Pool) => {
                return pool.end((err: any) => {

                });
            }
        ));
        this.pools.clear();
    }
}