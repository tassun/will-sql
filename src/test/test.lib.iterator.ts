import { Iterator } from "../utils/Iterator";

let values : string[] = [ 'insert', 'into', 'table1', 'values(', 'p1', '', 'p2' ];

let it = new Iterator<string>(values);
while(it.hasNext()) {
    console.log(it.next());
}
