import { Pool, PoolConnection } from 'mysql2';
import { MySQLPoolManager } from '../db/mysql2/MySQLPoolManager';

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });
    
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
    schema: "testdb",
    alias: "mysql2",
    dialect: "mysql",
    url: "mysql://root:root@localhost:3306/testdb?charset=utf8&connectionLimit=10",
    user: "root",
    password: "root",
    host: "localhost",
    port: 3306,
    database: "testdb",
    options: { charset: "utf8", connectionLimit: 10 },
};

async function testdb1(pool?: Pool) {
    if(!pool) pool = MySQLPoolManager.getPool(dbconfig);
    let conn = await getConnection(pool);
    let rs = await executeQuery(conn,"select * from testdbx where share = ? ",["BBL"]);
    delete rs.columns;
    console.log("testdb1.rs",rs);
    //conn.end(); //error using release 
    //conn.release(); //not exit to command prompt and found in process list
    conn.destroy(); //connection disappear in process list
}
async function testdb2() {
    let pool : Pool = MySQLPoolManager.getPool(dbconfig);
    await testdb1(pool);
    await testdb1(pool);
    readline.question("Press ENTER to exit", async () => {
        await testdb1(pool);
        console.log("pool end");
        pool.end();
        readline.close();
    });
}
async function testdb() {
    await testdb2();
}
testdb();
