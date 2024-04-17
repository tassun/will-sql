import { Connection } from 'mysql';
import { KnResultSet, KnSQLOptions, KnDBParam } from "../KnDBAlias";
import { KnDBUtils } from '../KnDBUtils';

export class MySQLDBQuery {
    
    public static executeQuery(conn: Connection, query: string | KnSQLOptions, params?: KnDBParam) : Promise<KnResultSet> {
        let sql = KnDBUtils.getQuery(query);
        let [parameters] = KnDBUtils.extractDBParam(params);
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

    public static executeUpdate(conn: Connection, query: string | KnSQLOptions, params?: KnDBParam) : Promise<KnResultSet> {
        let sql = KnDBUtils.getQuery(query);
        let [parameters] = KnDBUtils.extractDBParam(params);
        return new Promise<KnResultSet>((resolve, reject) => {
            conn.query(sql,parameters,(qerr, rows, fields) => {
                if(qerr) {
                    reject(qerr);
                } else {
                    resolve({ rows: { affectedRows: rows.affectedRows }, columns: fields });
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
