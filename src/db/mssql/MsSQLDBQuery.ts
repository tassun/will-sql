import { Request } from 'mssql';
import { ResultSet, DBParam, SQLOptions } from "../DBAlias";
import { DBUtils } from '../DBUtils';

export class MsSQLDBQuery {

    private static assignParameters(conn: Request,params?: DBParam) {
        if(params) {
            for(let p in params) {
                let pv = params[p];
                conn.input(p,pv.value);
            }
        }
    }
    
    public static async executeQuery(conn: Request, query: string | SQLOptions, params?: DBParam) : Promise<ResultSet> {
        let sql = DBUtils.getQuery(query);
        this.assignParameters(conn, params);
        let result = await conn.query(sql);
        return Promise.resolve({ rows: result.recordset, fields: null });
    }

    public static async executeUpdate(conn: Request, query: string | SQLOptions, params?: DBParam) : Promise<ResultSet> {
        let sql = DBUtils.getQuery(query);
        this.assignParameters(conn, params);
        let result = await conn.query(sql);
        return Promise.resolve({ rows: { affectedRows : result.rowsAffected[0] }, fields: null });
    }

    public static beginWork(conn: Request) : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            conn.transaction.begin(undefined,(err) => {
                if(err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    public static commitWork(conn: Request) : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            conn.transaction.commit((err) => {
                if(err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    public static rollbackWork(conn: Request) : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            conn.transaction.rollback( (err) => {
                if(err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

}
