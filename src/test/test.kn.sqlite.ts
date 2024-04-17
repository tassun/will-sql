import { KnDBConnections } from "../db/KnDBConnections";
import { KnSQL } from "../db/KnSQL";

async function testdb() {
    let knsql = new KnSQL();
    knsql.append("create table testdbx(share text, mktid text, yield numeric, percent numeric) ");
    const db = KnDBConnections.getDBConnector("SQLITE");
    let rs = await knsql.executeUpdate(db);
    console.log("rs",rs);

    knsql.clear();
    knsql.append("insert into testdbx(share,mktid,yield,percent) values(?share,?mktid,?yield,?percent)");
    knsql.set("share","BBL").set("mktid","TSO").set("yield",100.50).set("percent",50.5);
    await knsql.executeUpdate(db);
    knsql.set("share","SCB").set("mktid","TSO").set("yield",200.50).set("percent",60.5);
    await knsql.executeUpdate(db);

    await testselect();
}

async function testselect() {
    const db = KnDBConnections.getDBConnector("SQLITE");
    let knsql = new KnSQL();
    knsql.append("select * from testdbx ");
    let rs = await knsql.executeQuery(db);
    console.log("rs",rs);
}

async function testquery() {
    let knsql = new KnSQL();
    knsql.append("select * from testdbx where share = ?share ");
    knsql.set("share","BBL");
    const db = KnDBConnections.getDBConnector("SQLITE");
    let rs = await knsql.executeQuery(db);
    console.log("rs",rs);
}

async function testupdate() {
    let knsql = new KnSQL();
    knsql.append("update testdbx set percent = ?percent where mktid = ?mktid ");
    knsql.set("percent",60);
    knsql.set("mktid","TSO");
    const db = KnDBConnections.getDBConnector("SQLITE");
    let rs = await knsql.executeUpdate(db);
    console.log("update",rs);
    await testselect();
    db.close();
    db.end();
}

async function test() {
    await testdb();
    await testquery();
    await testupdate();
}

test();
