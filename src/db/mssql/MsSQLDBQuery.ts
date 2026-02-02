import { Request } from 'mssql';
import { KnResultSet, KnDBParam, KnSQLOptions } from "../KnDBAlias";
import { KnDBUtils } from '../KnDBUtils';

export class MsSQLDBQuery {

    private static assignParameters(conn: Request,params?: KnDBParam | Array<any>) {
        if(Array.isArray(params)) {
            for(let i = 0, isz = params.length; i < isz; i++) {
                let p = "p"+i; //assume that parameter name start with p0,p1,p2,...
                let paraValue = params[i];
                try {
                    conn.input(p,paraValue);
                } catch(ex) {
                    console.debug("fallback parameter assignment",ex);
                    conn.parameters[p].value = paraValue;
                }
            }
        } else if(params) {
            for(let p in params) {
                let pv = params[p];
                let paraValue = KnDBUtils.parseParamValue(pv);
                try {
                    conn.input(p,paraValue);
                } catch(ex) {
                    console.debug("fallback parameter assignment",ex);
                    conn.parameters[p].value = paraValue;
                }
            }            
        }
    }
    
    public static async executeQuery(conn: Request, query: string | KnSQLOptions, params?: KnDBParam | Array<any>) : Promise<KnResultSet> {
        let sql = KnDBUtils.getQuery(query);
        this.assignParameters(conn, params);
        let req = conn as any;
        req.arrayRowMode = true;
        let result = await conn.query(sql);
        let rows = result.recordset;
        let cols = (result as any).columns[0];
        for(let idx in rows) {
          let row = rows[idx];
          let json : any = {};
          cols.forEach((col:any) => {
            json[col.name] = row[col.index]; 
          });
          rows[idx] = json;
        };    
        return { rows: rows, columns: cols };
    }

    public static async executeUpdate(conn: Request, query: string | KnSQLOptions, params?: KnDBParam | Array<any>) : Promise<KnResultSet> {
        let sql = KnDBUtils.getQuery(query);
        this.assignParameters(conn, params);
        let result = await conn.query(sql);
        return { rows: { affectedRows : result.rowsAffected[0] }, columns: null };
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
