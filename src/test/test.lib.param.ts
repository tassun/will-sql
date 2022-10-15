import { DBParam, DBTypes } from "../db/DBAlias";
import { DBUtils } from "../db/DBUtils";
const params : DBParam = {
    sharecode: { value: "BBL", type: DBTypes.STRING },
    yield: { value: 200, type: DBTypes.DECIMAL },
    unit: { value: 300, type: DBTypes.DECIMAL },
    mktid: { value: "TEST", type: DBTypes.STRING }
};

console.log(params);
for(let p in params) {
    console.log(p+"=",params[p]);
}
console.log("===============================================");
let [pvalues,pnames,ptypes] = DBUtils.extractDBParam(params);
console.log("values",pvalues);
console.log("names",pnames);
console.log("types",ptypes);
console.log("===============================================");
let [values] = DBUtils.extractDBParam(params);
console.log("values",values);
let [,names] = DBUtils.extractDBParam(params);
console.log("names",names);
let [,,types] = DBUtils.extractDBParam(params);
console.log("types",types);
