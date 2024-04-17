import { KnDBConnections } from "../db/KnDBConnections";

async function testdb() {
    const db = KnDBConnections.getDBConnector("MYSQL8");
    console.log("db",db);
    let rs = await db.executeQuery("select * from testdbx");
    console.log("rs",rs);
    db.close();
}

async function test() {
    await testdb();
}

test();
