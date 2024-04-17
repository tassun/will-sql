import mysql from 'mysql';
import { Pool, MysqlError } from 'mysql';
import { KnDBConfig } from "../KnDBConfig";

export class MySQLPoolManager {
    public static pools = new Map<string,Pool>();
    public static getPool(dbcfg: KnDBConfig) : Pool {
        let pool = this.pools.get(dbcfg.schema);
        if(!pool) {
            pool = mysql.createPool(dbcfg.url);
            this.pools.set(dbcfg.schema,pool);
        }    
        return pool;
    }
    public static remove(schema: string) : void {
        let pool = this.pools.get(schema);
        if(pool) {
            pool.end((err: MysqlError) => {

            });
            this.pools.delete(schema);
        }
    }
    public static destroy() : void {
        let poolary = Array.from(this.pools.values());
        Promise.all(poolary.map((pool: Pool) => {
                return pool.end((err: MysqlError) => {

                });
            }
        ));
        this.pools.clear();
    }
}