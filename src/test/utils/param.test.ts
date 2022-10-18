import { DBParam, DBTypes } from "../../db/DBAlias";
import { DBUtils } from "../../db/DBUtils";
const params : DBParam = {
    sharecode: { value: "BBL", type: DBTypes.STRING },
    yield: { value: 200, type: DBTypes.DECIMAL },
    unit: { value: 300, type: DBTypes.DECIMAL },
    mktid: { value: "TEST", type: DBTypes.STRING }
};
describe('Test Parameters', () => {
    it("DBParam extract",() => {
        let [pvalues,pnames,ptypes] = DBUtils.extractDBParam(params);
        expect(pvalues).toStrictEqual(["BBL",200,300,"TEST"]);
        expect(pnames).toStrictEqual(["sharecode","yield","unit","mktid"]);
        expect(ptypes).toStrictEqual(["STRING","DECIMAL","DECIMAL","STRING"]);
    });
    it("DBParam extract values",() => {
        let [values] = DBUtils.extractDBParam(params);
        expect(values).toStrictEqual(["BBL",200,300,"TEST"]);
    });
    it("DBParam extract names",() => {
        let [,names] = DBUtils.extractDBParam(params);
        expect(names).toStrictEqual(["sharecode","yield","unit","mktid"]);
    });
    it("DBParam extract types",() => {
        let [,,types] = DBUtils.extractDBParam(params);
        expect(types).toStrictEqual(["STRING","DECIMAL","DECIMAL","STRING"]);
    });
});
