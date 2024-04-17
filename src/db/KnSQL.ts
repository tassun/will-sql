import { StringTokenizer } from "will-util";
import { KnDBConnector, KnDBAlias, KnDBTypes, KnEnumDBTypes, KnDBParam, KnDBValue, KnDBParamValue, KnResultSet, KnSQLOptions, KnSQLInterface } from "./KnDBAlias";
import { KnDBUtils } from "./KnDBUtils";
import { KnDBError } from "./KnDBError";

export class KnSQL implements KnSQLInterface {
    public sql: string;
    public options?: any;
    public readonly params : Map<string,KnDBValue> = new Map();
    constructor(sql: string = "", options?: any) {
        this.sql = sql;
        this.options = options;
    }
    public clear() : void {
        this.sql = "";
        this.params.clear();
    }
    public clearParameter() : void {
        this.params.clear();
    }
    public append(sql: string) : KnSQL {
        this.sql += sql;
        return this;
    }
    public set(
        paramname: string, 
        paramvalue: (string | number | boolean | bigint | null | undefined | Date | Buffer | KnDBParamValue), 
        paramtype: (KnDBTypes | KnEnumDBTypes) = KnDBTypes.STRING) 
        : KnSQL {   
        if(paramvalue === null) {
            this.params.set(paramname, new KnDBParamValue(paramvalue, KnDBUtils.parseDBTypes(paramtype)));
        } else if(paramvalue instanceof KnDBParamValue) {
            this.params.set(paramname, paramvalue);
        } else if(paramvalue instanceof Date) {
            this.params.set(paramname, new KnDBParamValue(paramvalue, KnDBUtils.parseDBTypes(paramtype)));
        } else {
            if(typeof paramvalue === "string" ) {
                this.params.set(paramname, new KnDBParamValue(paramvalue, KnDBUtils.parseDBTypes(paramtype)));
            } else if(typeof paramvalue === "number") {
                this.params.set(paramname, new KnDBParamValue(paramvalue, KnDBUtils.parseDBTypes(paramtype)));
            } else if(typeof paramvalue === "boolean") {
                this.params.set(paramname, new KnDBParamValue(paramvalue, KnDBTypes.BOOLEAN));
            } else if(typeof paramvalue === "bigint") {
                this.params.set(paramname, new KnDBParamValue(paramvalue, KnDBTypes.BIGINT));
            } else if(typeof paramvalue === "undefined") {
                this.params.set(paramname, new KnDBParamValue(paramvalue, KnDBUtils.parseDBTypes(paramtype)));
            }
        }
        return this;
    }
    public param(name: string) : KnDBValue {
        let result = this.params.get(name);
        if(!result) throw new KnDBError("Parameter '"+name+"' not found",-10101);
        return result;
    }
    public getExactlySql(alias: (string | KnDBAlias) = KnDBAlias.MYSQL) : [string,string[]] {
        let dbalias = KnDBUtils.parseDBAlias(alias);
        let odbc = dbalias == KnDBAlias.ODBC;
        let mysql = dbalias == KnDBAlias.MYSQL;
        let mssql = dbalias == KnDBAlias.MSSQL;
        let oracle = dbalias == KnDBAlias.ORACLE;
        let postgres = dbalias == KnDBAlias.POSTGRES;
        let sqlidx = 0;
        let sqlstr = "";
        let paramnames : string[] = [];
        let tok = new StringTokenizer(this.sql,"?), \n",true);
        let it = tok.iterator();
        while(it.hasNext()) {
            let element = it.next();
            if("?"==element) {
                sqlstr += (mysql||odbc?"?":(mssql?"@":(oracle?":":(postgres?"$":element))));
                if(it.hasNext()) {
                    let item = it.next();
                    if(!(" "==item) && !(")"==item) && !(","==item) && !("\n"==item)) {
                        paramnames.push(item);
                        if(mssql || oracle) sqlstr += item;
                        if(postgres) sqlstr += (++sqlidx); //$1,$2,$3,...
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
    public getDBParam(names: string[]) : KnDBParam {
        let results : KnDBParam = {};
        for(let name of names) {
            results[name] = this.param(name);
        }
        return results;
    }
    public getSQLOptions(db: KnDBConnector) : [KnSQLOptions, KnDBParam] {
        let [sql,paramnames] = this.getExactlySql(db.alias);
        let dbparam = this.getDBParam(paramnames);
        return [{ sql: sql, options: this.options }, dbparam];
    }
    public async executeQuery(db: KnDBConnector, ctx?: any) : Promise<KnResultSet> {
        let span = this.createSpan(db,ctx);
        try {
            let [sqlopts,dbparam] = this.getSQLOptions(db);
            return db.executeQuery(sqlopts, dbparam);
        } finally {
            if(span) span.finish();
        }
    }
    public async executeUpdate(db: KnDBConnector, ctx?: any) : Promise<KnResultSet> {
        let span = this.createSpan(db,ctx);
        try {
            let [sqlopts,dbparam] = this.getSQLOptions(db);
            return db.executeUpdate(sqlopts, dbparam);
        } finally {
            if(span) span.finish();
        }
    }
    public createSpan(db: KnDBConnector, ctx?: any) : any {
        try {
            if(ctx) {
                return ctx.startSpan(db.constructor.name,{tags: {sql: this.sql, config: db.config}});
            }
        } catch(ex: any) { }
        return undefined;
    }
}
