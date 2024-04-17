import { KnDBParam, KnDBTypes } from "../../db/KnDBAlias";
import { KnDBUtils } from "../../db/KnDBUtils";
const params : KnDBParam = {
    sharecode: { value: "BBL", type: KnDBTypes.STRING },
    yield: { value: 200, type: KnDBTypes.DECIMAL },
    unit: { value: 300, type: KnDBTypes.DECIMAL },
    mktid: { value: "TEST", type: KnDBTypes.STRING }
};
describe('Test Parameters', () => {
    it("DBParam extract",() => {
        let [pvalues,pnames,ptypes] = KnDBUtils.extractDBParam(params);
        expect(pvalues).toStrictEqual(["BBL",200,300,"TEST"]);
        expect(pnames).toStrictEqual(["sharecode","yield","unit","mktid"]);
        expect(ptypes).toStrictEqual(["STRING","DECIMAL","DECIMAL","STRING"]);
    });
    it("DBParam extract values",() => {
        let [values] = KnDBUtils.extractDBParam(params);
        expect(values).toStrictEqual(["BBL",200,300,"TEST"]);
    });
    it("DBParam extract names",() => {
        let [,names] = KnDBUtils.extractDBParam(params);
        expect(names).toStrictEqual(["sharecode","yield","unit","mktid"]);
    });
    it("DBParam extract types",() => {
        let [,,types] = KnDBUtils.extractDBParam(params);
        expect(types).toStrictEqual(["STRING","DECIMAL","DECIMAL","STRING"]);
    });
});
