import { StringTokenizer } from "../utils/StringTokenizer";

let sql1 = "select * from table1 where p1 = ?p1 and p2=?p2 ";
let sql2 = "insert into table1 values(?p1,?p2)";
let sql3 = "update p1=?p1, p2=?p2 , p3=?p3 where p4=?p4";
let sql4 = "select * from table1 \n";
sql4 += "where p1 = ?p1\n";
sql4 += " and p2=?p2 ";

let tok = new StringTokenizer(sql1,"?), \n",true);
console.log("sql1",tok.tokenize());
tok = new StringTokenizer(sql2,"?), \n",true);
console.log("sql2",tok.tokenize());
tok = new StringTokenizer(sql3,"?), \n",true);
console.log("sql3",tok.tokenize());
tok = new StringTokenizer(sql4,"?), \n",true);
let tok4 = tok.tokenize();
console.log("sql4",tok4);
console.log("sql4",sql4);
let qry4 = tok4.join("");
console.log("qry4",qry4);
