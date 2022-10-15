import oracledb from 'oracledb';
import { Connection } from 'oracledb';
import { ResultSet, SQLOptions, DBParam } from "../DBAlias";
import { DBUtils } from '../DBUtils';

export class OracleDBQuery {
    
    public static async executeQuery(conn: Connection, query: string | SQLOptions, params?: DBParam) : Promise<ResultSet> {
        let sql = DBUtils.getQuery(query);
        let [parameters] = DBUtils.extractDBParam(params);
        let result = await conn.execute(sql, parameters, {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });
        return Promise.resolve({ rows: result.rows, fields: result.metaData });
    }

    public static async executeUpdate(conn: Connection, query: string | SQLOptions, params?: DBParam) : Promise<ResultSet> {
        let sql = DBUtils.getQuery(query);
        let [parameters] = DBUtils.extractDBParam(params);
        let result = await conn.execute(sql, parameters, {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });
        return Promise.resolve({ rows: { affectedRows : result.rowsAffected }, fields: null });
    }

    public static beginWork(conn: Connection) : Promise<void> {
        oracledb.autoCommit = false;
        return Promise.resolve();
    }

    public static commitWork(conn: Connection) : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            conn.commit( (err:any) => {
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
            conn.rollback( (err:any) => {
                if(err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

}
