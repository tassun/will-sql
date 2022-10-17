import { Connection } from 'mysql';
import { ResultSet, SQLOptions, DBParam } from "../DBAlias";
import { DBUtils } from '../DBUtils';

export class MySQLDBQuery {
    
    public static executeQuery(conn: Connection, query: string | SQLOptions, params?: DBParam) : Promise<ResultSet> {
        let sql = DBUtils.getQuery(query);
        let [parameters] = DBUtils.extractDBParam(params);
        return new Promise<ResultSet>((resolve, reject) => {
            conn.query(sql,parameters,(qerr, rows, fields) => {
                if(qerr) {
                    reject(qerr);
                } else {
                    resolve({ rows: rows, columns: fields });
                }
            });
        });
    }

    public static executeUpdate(conn: Connection, query: string | SQLOptions, params?: DBParam) : Promise<ResultSet> {
        let sql = DBUtils.getQuery(query);
        let [parameters] = DBUtils.extractDBParam(params);
        return new Promise<ResultSet>((resolve, reject) => {
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
