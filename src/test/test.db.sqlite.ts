import { DBConnections } from "../db/DBConnections";

async function testdb() {
    const db = DBConnections.getDBConnector("SQLITE");
    console.log("db",db);
    await db.executeUpdate("create table testdbx(share text, mktid text, yield numeric, percent numeric)");
    await db.executeUpdate("insert into testdbx(share,mktid,yield,percent) values('BBL','TEST',100.50,25.50)");
    await db.executeUpdate("insert into testdbx(share,mktid,yield,percent) values('SCB','TEST',200.50,55.50)");

    let rs = await db.executeQuery("select * from testdbx");
    console.log("rs",rs);

    rs = await db.executeQuery("select * from testdbx where percent > ? ",{ 
        percent: {value: 50, type: "DECIMAL"} 
    });
    console.log("rs2",rs);
}

async function testupdate() {
    const db = DBConnections.getDBConnector("SQLITE");
    let rs = await db.executeQuery("select * from testdbx where share = ? ",{
        share: {value: "BBL", type: "STRING"}
    });
    console.log("rs",rs);

    rs = await db.executeUpdate("update testdbx set percent = ? where mktid = ? ",{ 
        percent: {value: 55, type: "DECIMAL"},
        mktid: {value: "TEST", type: "STRING"}
    });
    console.log("update",rs);

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
