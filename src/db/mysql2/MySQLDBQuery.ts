import { Connection, QueryResult, ResultSetHeader } from 'mysql2';
import { KnResultSet, KnSQLOptions, KnDBParam } from "../KnDBAlias";
import { KnDBUtils } from '../KnDBUtils';

export class MySQLDBQuery {
    
    public static isResultSet(result: QueryResult): result is ResultSetHeader {
        return (
            typeof result === "object" &&
            result !== null &&
            "affectedRows" in result
        );
    }

    public static executeQuery(conn: Connection, query: string | KnSQLOptions, params?: KnDBParam | Array<any>) : Promise<KnResultSet> {
        let sql = KnDBUtils.getQuery(query);
        let [parameters] = Array.isArray(params) ? [params] : KnDBUtils.extractDBParam(params);
        return new Promise<KnResultSet>((resolve, reject) => {
            conn.query(sql,parameters,(qerr, rows, fields) => {
                if(qerr) {
                    reject(qerr);
                } else {
                    resolve({ rows: rows, columns: fields });
                }
            });
        });
    }

    public static executeUpdate(conn: Connection, query: string | KnSQLOptions, params?: KnDBParam | Array<any>) : Promise<KnResultSet> {
        let sql = KnDBUtils.getQuery(query);
        let [parameters] = Array.isArray(params) ? [params] : KnDBUtils.extractDBParam(params);
        return new Promise<KnResultSet>((resolve, reject) => {
            conn.query(sql,parameters,(qerr, rows, fields) => {
                if(qerr) {
                    reject(qerr);
                } else {
                    let affectedRows = this.isResultSet(rows) ? rows.affectedRows : 0;
                    resolve({ rows: { affectedRows: affectedRows }, columns: fields });
                }
            });
        });
    }

    public static beginWork(conn: Connection) : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            conn.beginTransaction( (err) => {
                if(err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    public static commitWork(conn: Connection) : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            conn.commit( (err) => {
                if(err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    public static rollbackWork(conn: Connection) : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            conn.rollback( (err) => {
                if(err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

}
