import { StringTokenizer } from "../utils/StringTokenizer";
import { DBConnector, DBAlias, DBTypes, DBParam, DBValue, DBParamValue, ResultSet } from "./DBAlias";
import { DBUtils } from "./DBUtils";
import { DBError } from "./DBError";

type EnumDBTypes = keyof typeof DBTypes;
export class KnSQL {
    public sql: string;
    public options?: any;
    public readonly params : Map<string,DBValue> = new Map();
    constructor(sql: string = "", options?: any) {
        this.sql = sql;
        this.options = options;
    }
    public clear() : void {
        this.sql = "";
        this.params.clear();
    }
    public append(sql: string) : KnSQL {
        this.sql += sql;
        return this;
    }
    public set(
        paramname: string, 
        paramvalue: (string | number | boolean | bigint | null | undefined | Date | Buffer | DBParamValue), 
        paramtype: (DBTypes | EnumDBTypes) = DBTypes.STRING) 
        : KnSQL {   
        if(paramvalue === null) {
            this.params.set(paramname, new DBParamValue(paramvalue, DBUtils.parseDBTypes(paramtype)));
        } else if(paramvalue instanceof DBParamValue) {
            this.params.set(paramname, paramvalue);
        } else if(paramvalue instanceof Date) {
            this.params.set(paramname, new DBParamValue(paramvalue, DBUtils.parseDBTypes(paramtype)));
        } else {
            if(typeof paramvalue === "string" ) {
                this.params.set(paramname, new DBParamValue(paramvalue, DBUtils.parseDBTypes(paramtype)));
            } else if(typeof paramvalue === "number") {
                this.params.set(paramname, new DBParamValue(paramvalue, DBUtils.parseDBTypes(paramtype)));
            } else if(typeof paramvalue === "boolean") {
                this.params.set(paramname, new DBParamValue(paramvalue, DBTypes.BOOLEAN));
            } else if(typeof paramvalue === "bigint") {
                this.params.set(paramname, new DBParamValue(paramvalue, DBTypes.BIGINT));
            } else if(typeof paramvalue === "undefined") {
                this.params.set(paramname, new DBParamValue(paramvalue, DBUtils.parseDBTypes(paramtype)));
            }
        }
        return this;
    }
    public param(name: string) : DBValue {
        let result = this.params.get(name);
        if(!result) throw new DBError("Parameter '"+name+"' not found",-10101);
        return result;
    }
    public getExactlySql(alias: (string | DBAlias) = DBAlias.MYSQL) : [string,string[]] {
        let dbalias = DBUtils.parseDBAlias(alias);
        let odbc = dbalias == DBAlias.ODBC;
        let mysql = dbalias == DBAlias.MYSQL;
        let mssql = dbalias == DBAlias.MSSQL;
        let oracle = dbalias == DBAlias.ORACLE;
        let sqlstr = "";
        let paramnames : string[] = [];
        let tok = new StringTokenizer(this.sql,"?), \n",true);
        let it = tok.iterator();
        while(it.hasNext()) {
            let element = it.next();
            if("?"==element) {
                sqlstr += (mysql||odbc?"?":(mssql?"@":(oracle?":":element)));
                if(it.hasNext()) {
                    let item = it.next();
                    if(!(" "==item) && !(")"==item) && !(","==item) && !("\n"==item)) {
                        paramnames.push(item);
                        if(mssql || oracle) sqlstr += item;
                    } else {
                        sqlstr += item;
                    }
                }
            } else {
                sqlstr += element;
            }
        }
        return [sqlstr,paramnames];
    }
    public parameters(names: string[]) : any {
        let results = [];
        for(let name of names) {
            let pr = this.param(name);
            if(pr) {
                results.push(pr.value);
            } else {
                results.push(undefined);
            }
        };
        return results;
    }
    public getDBParam(names: string[]) : DBParam {
        let results : DBParam = {};
        for(let name of names) {
            results[name] = this.param(name);
        }
        return results;
    }
    public async executeQuery(db: DBConnector) : Promise<ResultSet> {
        let [sql,paramnames] = this.getExactlySql(db.alias);
        let dbparam = this.getDBParam(paramnames);
        return db.executeQuery({ sql: sql, options: this.options }, dbparam);
    }
    public async executeUpdate(db: DBConnector) : Promise<ResultSet> {
        let [sql,paramnames] = this.getExactlySql(db.alias);
        let dbparam = this.getDBParam(paramnames);
        return db.executeUpdate({ sql: sql, options: this.options }, dbparam);
    }
}
