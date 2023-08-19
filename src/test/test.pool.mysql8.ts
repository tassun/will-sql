import { Pool, PoolConnection } from 'mysql2';
import { MySQLPoolManager } from '../db/mysql2/MySQLPoolManager';

function getConnection(pool: Pool) : Promise<PoolConnection> {
    return new Promise<PoolConnection>((resolve, reject) => {
        pool.getConnection((cerr: any, conn: PoolConnection) => {
            if(cerr) {
                reject(cerr);
            } else {
                resolve(conn);
            }
        });
    });
}
function executeQuery(conn: PoolConnection, sql: string , params?: any) : Promise<any> {
    return new Promise<any>((resolve, reject) => {
        conn.query(sql,params,(qerr, rows, fields) => {
            if(qerr) {
                reject(qerr);
            } else {
                resolve({ rows: rows, columns: fields });
            }
        });
    });
}
let dbconfig = {
    schema: "quickloandb",
    alias: "mysql2",
    dialect: "mysql",
    url: "mysql://admin:Passw0rd1234@quickloan-db.cnalgmd3k6py.ap-southeast-1.rds.amazonaws.com:3306/quickloandb?charset=utf8&connectionLimit=10",
    user: "admin",
    password: "Passw0rd1234",
    host: "quickloan-db.cnalgmd3k6py.ap-southeast-1.rds.amazonaws.com",
    port: 3306,
    database: "quickloandb",
    options: { charset: "utf8", connectionLimit: 10 },
};

async function testdb1() {
    let pool : Pool = MySQLPoolManager.getPool(dbconfig);
    let conn = await getConnection(pool);
    let rs = await executeQuery(conn,"select * from tconfig where category = ? ",["notification"]);
    console.log("testdb1.rs",rs);
    conn.release();
}
async function testdb() {
    await testdb1();
}
testdb();
