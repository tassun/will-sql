import { DBConfig } from "../DBConfig";
import { Database } from "sqlite3";

export class SQLitePoolManager {
    public static pools = new Map<string,Database>();
    public static getPool(dbcfg: DBConfig) : Database {
        let db = this.pools.get(dbcfg.schema);
        if(!db) {
            db = new Database(dbcfg.url);
            this.pools.set(dbcfg.schema,db);
        }    
        return db;
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