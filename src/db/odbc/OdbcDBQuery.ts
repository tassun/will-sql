import { KnResultSet, KnSQLOptions, KnDBParam } from "../KnDBAlias";
import { KnDBUtils } from "../KnDBUtils";

export class OdbcDBQuery {
    
    private static removeAttributes(rows: any) {
        const fieldnames = ["statement","parameters","return","count","columns"];
        fieldnames.forEach(function(name) {
            if(rows.hasOwnProperty(name)) {
                delete rows[name];
            }
        });            
    }

    public static executeQuery(conn: any, query: string | KnSQLOptions, params?: KnDBParam) : Promise<KnResultSet> {
        let sql = KnDBUtils.getQuery(query);
        let [parameters] = KnDBUtils.extractDBParam(params);
        return new Promise<KnResultSet>((resolve, reject) => {
            conn.query(sql,parameters,(qerr: any, rows: any) => {
                if(qerr) {
                    reject(qerr);
                } else {
                    let columns = rows.columns;
                    this.removeAttributes(rows);
                    resolve({ rows: rows, columns: columns });
                }
            });
        });
    }

    public static executeUpdate(conn: any, query: string | KnSQLOptions, params?: KnDBParam) : Promise<KnResultSet> {
        let sql = KnDBUtils.getQuery(query);
        let [parameters] = KnDBUtils.extractDBParam(params);
        return new Promise<KnResultSet>((resolve, reject) => {
            conn.query(sql,parameters,(qerr: any, rows: any) => {
                if(qerr) {
                    reject(qerr);
                } else {
                    let count = rows.count;
                    let columns = rows.columns;
                    resolve({ rows: { affectedRows: count }, columns: columns });
                }
            });
        });
    }

    public static async statementQuery(conn: any, query: string | KnSQLOptions, params?: KnDBParam) : Promise<KnResultSet> {
        let sql = KnDBUtils.getQuery(query);
        let [parameters] = KnDBUtils.extractDBParam(params);
        const stm = await conn.createStatement();
        await stm.prepare(sql);
        await stm.bind(parameters);
        const rows = await stm.execute();
        let columns = rows.columns;
        this.removeAttributes(rows);
        return Promise.resolve({ rows: rows, columns: columns });
    }

    public static async statementUpdate(conn: any, query: string | KnSQLOptions, params?: KnDBParam) : Promise<KnResultSet> {
        let sql = KnDBUtils.getQuery(query);
        let [parameters] = KnDBUtils.extractDBParam(params);
        const stm = await conn.createStatement();
        await stm.prepare(sql);
        await stm.bind(parameters);
        const rows = await stm.execute();
        let count = rows.count;
        let columns = rows.columns;
        return Promise.resolve({ rows: { affectedRows: count }, columns: columns });
    }

    public static  beginWork(conn: any) : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            conn.beginTransaction( (err: any) => {
                if(err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    public static commitWork(conn: any) : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            conn.commit( (err: any) => {
                if(err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    public static rollbackWork(conn: any) : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            conn.rollback( (err: any) => {
                if(err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

}