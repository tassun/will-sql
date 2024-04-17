import { KnDBConnections } from "../db/KnDBConnections";
import { KnSQL } from "../db/KnSQL";

let dbschema = "MYSQL";
let args = process.argv.slice(2);
if(args.length>0) dbschema = args[0];
console.log("db schema",dbschema);
async function testmake() {
    let values = ["AAA","BBB","CCC","DDD","EEE","FFF","GGG","HHH","III","JJJ","KKK","LLL","MMM","NNN","OOO","PPP","QQQ","RRR","SSS","TTT","UUU","VVV","WWW","XXX","YYY","ZZZ","$$$"];
    let knsql = new KnSQL();
    knsql.append("insert into test1(field1,field2) values(?field1,?field2) ");
    const db = KnDBConnections.getDBConnector(dbschema);
    await db.beginWork();
    for(let idx in values) {
        let val = values[idx];
        knsql.set("field1","F"+idx);
        knsql.set("field2",val);
        console.log(knsql);
        await knsql.executeUpdate(db);
    }
    await db.commitWork();
    db.close();
    db.end();
}

async function test() {
    await testmake();
}

test();
