import { KnDBConnections } from "../db/KnDBConnections";
import { OraclePoolManager } from "../db/oracle/OraclePoolManager";

async function testdb1() {
    const db = KnDBConnections.getDBConnector("ORACLE");
    console.log("db",db);
    let rs = await db.executeQuery("select * from testdbx");
    console.log("rs",rs);
    db.close();
    console.log("testdb1.pools",OraclePoolManager.pools); //expect 1
}

async function testdb2() {
    const db = KnDBConnections.getDBConnector("ORACLE2");
    console.log("db",db);
    let rs = await db.executeQuery("select * from testdbx");
    console.log("rs",rs);
    console.log("testdb2.pools",OraclePoolManager.pools); //expect 2
    db.close();
    db.end();
    console.log("testdb2.pools",OraclePoolManager.pools); // expect 0
}

async function test() {
    await testdb1();
    await testdb2();
}

test();
