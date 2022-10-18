import { Pool, PoolConnection, MysqlError } from 'mysql';
import { MySQLPoolManager } from '../db/mysql/MySQLPoolManager';

function getConnection(pool: Pool) : Promise<PoolConnection> {
    return new Promise<PoolConnection>((resolve, reject) => {
        pool.getConnection((cerr: MysqlError, conn: PoolConnection) => {
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
async function testdb1() {
    let pool : Pool = MySQLPoolManager.getPool({
        schema: "testdb",
        alias: "mysql",
        dialect: "mysql",
        url: "mysql://root:root@localhost:3306/testdb?charset=utf8&connectionLimit=10",
        user: "root",
        password: "root",
    });
    let conn = await getConnection(pool);
    let rs = await executeQuery(conn,"select * from testdbx where share = ? ",["BBL"]);
    console.log("testdb1.rs",rs);
    conn.release();
}
async function testdb2() {
    console.log("testdb2.pools",MySQLPoolManager.pools); //expect 1
    let pool : Pool = MySQLPoolManager.getPool({
        schema: "testdb",
        alias: "mysql",
        dialect: "mysql",
        url: "mysql://root:root@localhost:3306/testdb?charset=utf8&connectionLimit=10",
        user: "root",
        password: "root",
    });
    console.log("testdb2.pools",MySQLPoolManager.pools); //expect 1
    let conn = await getConnection(pool);
    let rs = await executeQuery(conn,"select * from testdbx where share = ? ",["BBL"]);
    console.log("testdb2.rs",rs);
    conn.release();
}
async function testdb3() {
    let pool : Pool = MySQLPoolManager.getPool({
        schema: "basedb",
        alias: "mysql",
        dialect: "mysql",
        url: "mysql://root:root@localhost:3306/basedb?charset=utf8&connectionLimit=10",
        user: "root",
        password: "root",
    });
    console.log("testdb3.pools",MySQLPoolManager.pools); //expect 2
    let conn = await getConnection(pool);
    let rs = await executeQuery(conn,"select * from testdbx where share = ? ",["KTB"]);
    console.log("testdb3.rs",rs);
    conn.release();
    MySQLPoolManager.destroy();
    console.log("testdb3.pools",MySQLPoolManager.pools); //expect 0
}
async function testdb4() {
    let pool : Pool = MySQLPoolManager.getPool({
        schema: "accessdb",
        alias: "mysql",
        dialect: "mysql",
        url: "mysql://root:root@localhost:3306/accessdb?charset=utf8&connectionLimit=10",
        user: "root",
        password: "root",
    });
    console.log("testdb4.pools",MySQLPoolManager.pools); //expect 1
    let conn = await getConnection(pool);
    let rs = await executeQuery(conn,"select * from testdbx where share = ? ",["SCB"]);
    console.log("testdb4.rs",rs);
    conn.release();
    MySQLPoolManager.destroy();
    console.log("testdb4.pools",MySQLPoolManager.pools); //expect 0
}
async function testdb() {
    await testdb1();
    await testdb2();
    await testdb3();    
    await testdb4();    
}
testdb();
