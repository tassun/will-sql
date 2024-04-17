import { KnDBConnections } from "../db/KnDBConnections";

async function testdb() {
    const db = KnDBConnections.getDBConnector("MYSQL8");
    console.log("db",db);
    let rs = await db.executeQuery("select * from testdbx");
    console.log("rs",rs);
    rs = await db.executeQuery("select * from testdbx where percent > ? ",{ 
        percent: {value: 50, type: "DECIMAL"} 
    });
    console.log("rs2",rs);
    db.close();
}

async function testupdate() {
    const db = KnDBConnections.getDBConnector("MYSQL8");
    let rs = await db.executeQuery("select * from testdbx where share = ? ",{
        share: {value: "BBL", type: "STRING"}
    });
    console.log("rs",rs);
    await db.beginWork();
    rs = await db.executeUpdate("update testdbx set percent = ? where mktid = ? ",{ 
        percent: {value: 55, type: "DECIMAL"},
        mktid: {value: "TSO", type: "STRING"}
    });
    console.log("update",rs);
    await db.commitWork();
    rs = await db.executeQuery("select * from testdbx where share = ? ",{
        share: {value: "BBL", type: "STRING"}
    });
    console.log("rs2",rs);
    db.close();
    db.end();
}

async function test() {
    await testdb();
    await testupdate();
}

test();
