import mysql, { Pool } from 'mysql2';
import { KnDBConfig } from "../KnDBConfig";
import config from "will-util";

const CAST_DB_TYPES = config.env("CAST_DB_TYPES","DECIMAL,JSON") as string;
const CAST_DB_TYPES_DECIMAL = CAST_DB_TYPES.includes("DECIMAL");
const CAST_DB_TYPES_JSON = CAST_DB_TYPES.includes("JSON");

export class MySQLPoolManager {
    public static readonly pools = new Map<string,Pool>();
    public static getPool(dbcfg: KnDBConfig) : Pool {
        let pool = this.pools.get(dbcfg.schema);
        if(!pool) {
            pool = mysql.createPool({
                user: dbcfg.user,
                password: dbcfg.password,
                host: dbcfg.host,
                port: dbcfg.port,
                database: dbcfg.database,                
                typeCast: function (field: any, next: any) {
                    if (field.type == 'BIT' && field.length == 1) {
                        let value = field.buffer();
                        return (value === null) ? null : value[0] === 1;
                    } else if (CAST_DB_TYPES_DECIMAL && (field.type == "DECIMAL" || field.type == "NEWDECIMAL")) {
                        let value = field.string();
                        return (value === null) ? null : Number(value);
                    } else if (CAST_DB_TYPES_JSON && field.type == 'JSON') {
                        let value = field.string();
                        return (value === null) ? null : JSON.parse(value.toString('utf8'));
                    }
                    return next();
                },
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