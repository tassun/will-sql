import { KnDBConnections } from "../db/KnDBConnections";
import { KnSQL } from "../db/KnSQL";

async function testexecute() {
    let knsql = new KnSQL();
    knsql.append("select * from testdbx where share = ?share ");
    knsql.set("share","BBL");
    const db = KnDBConnections.getDBConnector("MYSQL");
    console.log("db",db);
    let rs = await db.executeQuery(knsql);
    console.log("rs",rs);
    db.close();
}

async function testdb() {
    let knsql = new KnSQL();
    knsql.append("select * from testdbx where share = ?share ");
    knsql.set("share","BBL");
    const db = KnDBConnections.getDBConnector("MYSQL");
    console.log("db",db);
    let rs = await db.execQuery(knsql);
    console.log("rs",rs);
    db.close();
}

async function testupdate() {
    let knsql = new KnSQL();
    knsql.append("update testdbx set percent = ?percent where mktid = ?mktid ");
    knsql.set("percent",60);
    knsql.set("mktid","TSO");
    const db = KnDBConnections.getDBConnector("MYSQL");
    try {
        await db.beginWork();
        let rs = await db.execUpdate(knsql);
        console.log("update",rs);
        await db.commitWork();
    } catch(ex) {
        await db.rollbackWork();
    }
    db.close();
    db.end();
}

async function test() {
    await testexecute();
    await testdb();
    await testupdate();
}

test();
