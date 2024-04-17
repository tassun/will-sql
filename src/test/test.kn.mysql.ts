import { KnDBConnections } from "../db/KnDBConnections";
import { KnSQL } from "../db/KnSQL";

async function testdb() {
    let knsql = new KnSQL();
    knsql.append("select * from testdbx where share = ?share ");
    knsql.set("share","BBL");
    const db = KnDBConnections.getDBConnector("MYSQL");
    let rs = await knsql.executeQuery(db);
    console.log("rs",rs);
    db.close();
}

async function testupdate() {
    let knsql = new KnSQL();
    knsql.append("update testdbx set percent = ?percent where mktid = ?mktid ");
    knsql.set("percent",60);
    knsql.set("mktid","TSO");
    const db = KnDBConnections.getDBConnector("MYSQL");
    await db.beginWork();
    let rs = await knsql.executeUpdate(db);
    console.log("update",rs);
    await db.commitWork();
    db.close();
    db.end();
}

async function test() {
    await testdb();
    await testupdate();
}

test();
