import { ResultSet, SQLOptions, DBParam } from "../DBAlias";
import { DBUtils } from "../DBUtils";

export class OdbcDBQuery {
    
    private static removeAttributes(rows: any) {
        const fieldnames = ["statement","parameters","return","count","columns"];
        fieldnames.forEach(function(name) {
            if(rows.hasOwnProperty(name)) {
                delete rows[name];
            }
        });            
    }

    public static executeQuery(conn: any, query: string | SQLOptions, params?: DBParam) : Promise<ResultSet> {
        let sql = DBUtils.getQuery(query);
        let [parameters] = DBUtils.extractDBParam(params);
        return new Promise<ResultSet>((resolve, reject) => {
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

    public static executeUpdate(conn: any, query: string | SQLOptions, params?: DBParam) : Promise<ResultSet> {
        let sql = DBUtils.getQuery(query);
        let [parameters] = DBUtils.extractDBParam(params);
        return new Promise<ResultSet>((resolve, reject) => {
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

    public static async statementQuery(conn: any, query: string | SQLOptions, params?: DBParam) : Promise<ResultSet> {
        let sql = DBUtils.getQuery(query);
        let [parameters] = DBUtils.extractDBParam(params);
        const stm = await conn.createStatement();
        await stm.prepare(sql);
        await stm.bind(parameters);
        const rows = await stm.execute();
        let columns = rows.columns;
        this.removeAttributes(rows);
        return Promise.resolve({ rows: rows, columns: columns });
    }

    public static async statementUpdate(conn: any, query: string | SQLOptions, params?: DBParam) : Promise<ResultSet> {
        let sql = DBUtils.getQuery(query);
        let [parameters] = DBUtils.extractDBParam(params);
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