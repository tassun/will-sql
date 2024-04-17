import { KnResultSet, KnSQLOptions, KnDBParam } from "../KnDBAlias";
import { KnDBUtils } from "../KnDBUtils";
import { Database } from "sqlite3";

export class SQLiteDBQuery {
    
    public static executeQuery(conn: Database, query: string | KnSQLOptions, params?: KnDBParam) : Promise<KnResultSet> {
        let sql = KnDBUtils.getQuery(query);
        let [parameters] = KnDBUtils.extractDBParam(params);
        return new Promise<KnResultSet>((resolve, reject) => {
            conn.all(sql,parameters,(qerr: any, rows: any) => {
                if(qerr) {
                    reject(qerr);
                } else {
                    let columns = null;
                    resolve({ rows: rows, columns: columns });
                }
            });
        });
    }

    public static executeUpdate(conn: Database, query: string | KnSQLOptions, params?: KnDBParam) : Promise<KnResultSet> {
        let sql = KnDBUtils.getQuery(query);
        let [parameters] = KnDBUtils.extractDBParam(params);
        return new Promise<KnResultSet>((resolve, reject) => {
            conn.run(sql,parameters,(rows: any, qerr: any) => {
                if(qerr) {
                    reject(qerr);
                } else {
                    let count = rows?.changes;
                    let columns = null;
                    resolve({ rows: { affectedRows: count }, columns: columns });
                }
            });
        });
    }

    public static async statementQuery(conn: Database, query: string | KnSQLOptions, params?: KnDBParam) : Promise<KnResultSet> {
        let sql = KnDBUtils.getQuery(query);
        let [parameters] = KnDBUtils.extractDBParam(params);
        const stm = conn.prepare(sql);
        const rows = stm.all(parameters);
        return Promise.resolve({ rows: rows, columns: null });
    }

    public static async statementUpdate(conn: Database, query: string | KnSQLOptions, params?: KnDBParam) : Promise<KnResultSet> {
        let sql = KnDBUtils.getQuery(query);
        let [parameters] = KnDBUtils.extractDBParam(params);
        const stm = conn.prepare(sql);
        const rows = stm.run(parameters) as any;
        let count = rows?.changes;
        return Promise.resolve({ rows: { affectedRows: count }, columns: null });
    }

    public static beginWork(conn: Database) : Promise<void> {
        return Promise.resolve();
    }

    public static commitWork(conn: Database) : Promise<void> {
        return Promise.resolve();
    }

    public static rollbackWork(conn: Database) : Promise<void> {
        return Promise.resolve();
    }

}