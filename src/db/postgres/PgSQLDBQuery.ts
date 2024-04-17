import { PoolClient } from 'pg';
import { KnResultSet, KnSQLOptions, KnDBParam } from "../KnDBAlias";
import { KnDBUtils } from '../KnDBUtils';

export class PgSQLDBQuery {
    
    public static executeQuery(conn: PoolClient, query: string | KnSQLOptions, params?: KnDBParam) : Promise<KnResultSet> {
        let sql = KnDBUtils.getQuery(query);
        let [parameters] = KnDBUtils.extractDBParam(params);
        return new Promise<KnResultSet>((resolve, reject) => {
            conn.query(sql,parameters,(qerr, rows) => {
                if(qerr) {
                    reject(qerr);
                } else {
                    resolve({ rows: rows.rows, columns: rows.fields });
                }
            });
        });
    }

    public static executeUpdate(conn: PoolClient, query: string | KnSQLOptions, params?: KnDBParam) : Promise<KnResultSet> {
        let sql = KnDBUtils.getQuery(query);
        let [parameters] = KnDBUtils.extractDBParam(params);
        return new Promise<KnResultSet>((resolve, reject) => {
            conn.query(sql,parameters,(qerr, rows) => {
                if(qerr) {
                    reject(qerr);
                } else {
                    resolve({ rows: { affectedRows: rows.rowCount }, columns: rows.fields });
                }
            });
        });
    }

    public static async beginWork(conn: PoolClient) : Promise<void> {
        await conn.query("BEGIN");
    }

    public static async commitWork(conn: PoolClient) : Promise<void> {
        await conn.query("COMMIT");
    }

    public static async rollbackWork(conn: PoolClient) : Promise<void> {
        await conn.query("ROLLBACK");
    }

}
