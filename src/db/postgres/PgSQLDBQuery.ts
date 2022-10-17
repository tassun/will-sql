import { PoolClient } from 'pg';
import { ResultSet, SQLOptions, DBParam } from "../DBAlias";
import { DBUtils } from '../DBUtils';

export class PgSQLDBQuery {
    
    public static executeQuery(conn: PoolClient, query: string | SQLOptions, params?: DBParam) : Promise<ResultSet> {
        let sql = DBUtils.getQuery(query);
        let [parameters] = DBUtils.extractDBParam(params);
        return new Promise<ResultSet>((resolve, reject) => {
            conn.query(sql,parameters,(qerr, rows) => {
                if(qerr) {
                    reject(qerr);
                } else {
                    resolve({ rows: rows.rows, columns: rows.fields });
                }
            });
        });
    }

    public static executeUpdate(conn: PoolClient, query: string | SQLOptions, params?: DBParam) : Promise<ResultSet> {
        let sql = DBUtils.getQuery(query);
        let [parameters] = DBUtils.extractDBParam(params);
        return new Promise<ResultSet>((resolve, reject) => {
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
