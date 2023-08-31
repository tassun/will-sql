import { DBConnections } from "../db/DBConnections";
import { KnSQL } from "../db/KnSQL";

async function testdb() {
    let knsql = new KnSQL();
    knsql.append("select * from testdbx where share = ?share ");
    knsql.set("share","BBL");
    const db = DBConnections.getDBConnector("MYSQL");
    let rs = await knsql.executeQuery(db);
    console.log("rs",rs);
    db.close();
}

async function testupdate() {
    let knsql = new KnSQL();
    knsql.append("update testdbx set percent = ?percent, ");
    knsql.append("editdate=?editdate, edittime=?edittime ");
    knsql.append("where mktid = ?mktid ");
    knsql.set("percent","60.50","DECIMAL");
    knsql.set("editdate","01/01/2023","DATE");
    knsql.set("edittime","10:10:10","TIME");
    knsql.set("mktid","TSO");
    const db = DBConnections.getDBConnector("MYSQL");
    await db.beginWork();
    let rs = await knsql.executeUpdate(db);
    console.log("update",rs);
    await db.commitWork();
    db.close();
}

async function test() {
    await testupdate();
    await testdb();
}

test();
