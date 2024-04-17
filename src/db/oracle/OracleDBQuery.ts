import oracledb from 'oracledb';
import { Connection } from 'oracledb';
import { KnResultSet, KnSQLOptions, KnDBParam } from "../KnDBAlias";
import { KnDBUtils } from '../KnDBUtils';

export class OracleDBQuery {
    
    public static async executeQuery(conn: Connection, query: string | KnSQLOptions, params?: KnDBParam) : Promise<KnResultSet> {
        let sql = KnDBUtils.getQuery(query);
        let [parameters] = KnDBUtils.extractDBParam(params);
        let result = await conn.execute(sql, parameters, {
            outFormat: oracledb.OUT_FORMAT_OBJECT,
            extendedMetaData: true
        });
        return Promise.resolve({ rows: result.rows, columns: result.metaData });
    }

    public static async executeUpdate(conn: Connection, query: string | KnSQLOptions, params?: KnDBParam) : Promise<KnResultSet> {
        let sql = KnDBUtils.getQuery(query);
        let [parameters] = KnDBUtils.extractDBParam(params);
        let result = await conn.execute(sql, parameters, {
            outFormat: oracledb.OUT_FORMAT_OBJECT,
            extendedMetaData: true
        });
        return Promise.resolve({ rows: { affectedRows : result.rowsAffected }, columns: null });
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
