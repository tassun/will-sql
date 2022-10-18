import { DBConnections } from "../db/DBConnections";
import { MsSQLPoolManager } from "../db/mssql/MsSQLPoolManager";

async function testdb1() {
    const db = DBConnections.getDBConnector("MSSQL");
    console.log("db",db);
    let rs = await db.executeQuery("select * from testdbx");
    console.log("rs",rs);
    db.close();
    console.log("testdb1.pools",MsSQLPoolManager.pools); //expect 1
}

async function testdb2() {
    const db = DBConnections.getDBConnector("MSSQL2");
    console.log("db",db);
    let rs = await db.executeQuery("select * from testdbx");
    console.log("rs",rs);
    console.log("testdb2.pools",MsSQLPoolManager.pools); //expect 2
    db.close();
    db.end();
    console.log("testdb2.pools",MsSQLPoolManager.pools); // expect 0
}

async function test() {
    await testdb1();
    await testdb2();
}

test();
