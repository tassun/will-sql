import { DBConnections } from "../db/DBConnections";
import { OdbcPoolManager } from "../db/odbc/OdbcPoolManager";

async function testdb1() {
    const db = DBConnections.getDBConnector("ODBC");
    console.log("db",db);
    let rs = await db.executeQuery("select * from testdbx");
    console.log("rs",rs);
    db.close();
    console.log("testdb1.pools",OdbcPoolManager.pools); //expect 1
}

async function testdb2() {
    const db = DBConnections.getDBConnector("ODBC2");
    console.log("db",db);
    let rs = await db.executeQuery("select * from testdbx");
    console.log("rs",rs);
    console.log("testdb2.pools",OdbcPoolManager.pools); //expect 2
    db.close();
    db.end();
    console.log("testdb2.pools",OdbcPoolManager.pools); // expect 0
}

async function test() {
    await testdb1();
    await testdb2();
}

test();
