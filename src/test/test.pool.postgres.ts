import { KnDBConnections } from "../db/KnDBConnections";
import { PgSQLPoolManager } from "../db/postgres/PgSQLPoolManager";

async function testdb1() {
    const db = KnDBConnections.getDBConnector("POSTGRES");
    console.log("db",db);
    let rs = await db.executeQuery("select * from testdbx");
    console.log("rs",rs);
    db.close();
    console.log("testdb1.pools",PgSQLPoolManager.pools); //expect 1
}

async function testdb2() {
    const db = KnDBConnections.getDBConnector("POSTGRES2");
    console.log("db",db);
    let rs = await db.executeQuery("select * from testdbx");
    console.log("rs",rs);
    console.log("testdb2.pools",PgSQLPoolManager.pools); //expect 2
    db.close();
    db.end();
    console.log("testdb2.pools",PgSQLPoolManager.pools); // expect 0
}

async function test() {
    await testdb1();
    await testdb2();
}

test();
