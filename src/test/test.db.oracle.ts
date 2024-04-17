import { KnDBConnections } from "../db/KnDBConnections";

async function testdb() {
    const db = KnDBConnections.getDBConnector("ORACLE");
    console.log("db",db);
    let rs = await db.executeQuery("select * from testdbx");
    console.log("rs",rs);
    db.close();
}

async function testupdate() {
    const db = KnDBConnections.getDBConnector("ORACLE");
    let rs = await db.executeQuery("select * from testdbx where sharecode = :sharecode ",{
        sharecode: {value: "BBL", type: "STRING"}
    });
    console.log("rs",rs);
    await db.beginWork();
    rs = await db.executeUpdate("update testdbx set percentage = :percentage where mktid = :mktid ",{
        percentage: {value: 55, type: "DECIMAL"},
        mktid: {value: "TSO", type: "STRING"}
    });
    console.log("update",rs);
    await db.commitWork();
    rs = await db.executeQuery("select * from testdbx where sharecode = :sharecode ",{
        sharecode: {value: "BBL", type: "STRING"}
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
