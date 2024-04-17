import { KnDBConnections } from "../db/KnDBConnections";

async function testdb() {
    const db = KnDBConnections.getDBConnector("POSTGRES");
    console.log("db",db);
    let rs = await db.executeQuery("select * from testdbx");
    console.log("rs",rs);
    rs = await db.executeQuery("select * from testdbx where percentage > $1 ",{ 
        percent: {value: 50, type: "DECIMAL"} 
    });
    console.log("rs2",rs);
    db.close();
}

async function testupdate() {
    const db = KnDBConnections.getDBConnector("POSTGRES");
    let rs = await db.executeQuery("select * from testdbx where sharecode = $1 ",{
        share: {value: "BBL", type: "STRING"}
    });
    console.log("rs",rs);
    await db.beginWork();
    rs = await db.executeUpdate("update testdbx set percentage = $1 where mktid = $2 ",{ 
        percent: {value: 55, type: "DECIMAL"},
        mktid: {value: "TSO", type: "STRING"}
    });
    console.log("update",rs);
    await db.commitWork();
    rs = await db.executeQuery("select * from testdbx where sharecode = $1 ",{
        share: {value: "BBL", type: "STRING"}
    });
    console.log("rs2",rs);
    db.close(); //close connection
    db.end(); //close pool
}

async function test() {
    await testdb();
    await testupdate();
}

test();
