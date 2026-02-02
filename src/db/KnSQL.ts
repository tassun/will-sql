import { StringTokenizer } from "will-util";
import { KnDBConnector, KnDBAlias, KnDBTypes, KnEnumDBTypes, KnDBParam, KnDBValue, KnDBParamValue, KnResultSet, KnSQLOptions, KnSQLInterface } from "./KnDBAlias";
import { KnDBUtils } from "./KnDBUtils";
import { KnDBError } from "./KnDBError";

const UNPRINTED = process.env["UNPRINTED"] || "unprint";

export class KnSQL implements KnSQLInterface {
    public sql: string;
    public options?: any;
    public readonly params : Map<string,KnDBValue> = new Map();
    constructor(sql: string = "", options?: any) {
        this.sql = sql;
        this.options = options;
    }
    public clear() : KnSQLInterface {
        this.sql = "";
        this.params.clear();
        return this;
    }
    public clearParameter() : KnSQLInterface {
        this.params.clear();
        return this;
    }
    public append(sql: string) : KnSQLInterface {
        this.sql += sql;
        return this;
    }
    public set(
        paramname: string, 
        paramvalue: (string | number | boolean | bigint | null | undefined | Date | Buffer | KnDBParamValue), 
        paramtype: (KnDBTypes | KnEnumDBTypes) = KnDBTypes.STRING) 
        : KnSQLInterface {   
        if(paramvalue === null) {
            this.params.set(paramname, new KnDBParamValue(paramvalue, KnDBUtils.parseDBTypes(paramtype)));
        } else if(paramvalue instanceof KnDBParamValue) {
            this.params.set(paramname, paramvalue);
        } else if(paramvalue instanceof Date) {
            this.params.set(paramname, new KnDBParamValue(paramvalue, KnDBUtils.parseDBTypes(paramtype)));
        } else if(typeof paramvalue === "string" ) {
            this.params.set(paramname, new KnDBParamValue(paramvalue, KnDBUtils.parseDBTypes(paramtype)));
        } else if(typeof paramvalue === "number") {
            this.params.set(paramname, new KnDBParamValue(paramvalue, KnDBUtils.parseDBTypes(paramtype)));
        } else if(typeof paramvalue === "boolean") {
            this.params.set(paramname, new KnDBParamValue(paramvalue, KnDBTypes.BOOLEAN));
        } else if(typeof paramvalue === "bigint") {
            this.params.set(paramname, new KnDBParamValue(paramvalue, KnDBTypes.BIGINT));
        } else if(paramvalue === undefined) {
            this.params.set(paramname, new KnDBParamValue(paramvalue, KnDBUtils.parseDBTypes(paramtype)));            
        }
        return this;
    }
    public param(name: string) : KnDBValue {
        let result = this.params.get(name);
        if(!result) throw new KnDBError("Parameter '"+name+"' not found",-10101);
        return result;
    }
    protected getPlaceHolder(dba: any, element: string) : string {
        if (dba.mysql || dba.odbc) {
            return "?";
        } else if (dba.mssql) {
            return "@";
        } else if (dba.oracle) {
            return ":";
        } else if (dba.postgres) {
            return "$";
        }
        return element;
    }
    protected isParamToken(item: string) : boolean {
        return item !== " " && item !== ")" && item !== "," && item !== "\n";
    }
    protected getSqlItem(dba: any, item: string, index: number, paramnames: string[]) : [string,number] {
        let sqlstr = "";
        if(this.isParamToken(item)) {
            paramnames.push(item);
            if(dba.mssql || dba.oracle) sqlstr += item;
            if(dba.postgres) sqlstr += (++index); //$1,$2,$3,...
        } else {
            sqlstr += item;
        }
        return [sqlstr,index];
    }
    public getExactlySql(alias: (string | KnDBAlias) = KnDBAlias.MYSQL) : [string,string[]] {
        let dbalias = KnDBUtils.parseDBAlias(alias);
        let dba = {
            odbc : dbalias == KnDBAlias.ODBC,
            mysql : dbalias == KnDBAlias.MYSQL,
            mssql : dbalias == KnDBAlias.MSSQL,
            oracle : dbalias == KnDBAlias.ORACLE,
            postgres : dbalias == KnDBAlias.POSTGRES
        };
        let sqlidx = 0;
        let sqlstr = "";
        let paramnames : string[] = [];
        let tok = new StringTokenizer(this.sql,"?), \n",true);
        let it = tok.iterator();
        while(it.hasNext()) {
            let element = it.next();
            if("?"==element) {
                sqlstr += this.getPlaceHolder(dba,element);
                if(it.hasNext()) {
                    let item = it.next();
                    let [str,idx] = this.getSqlItem(dba,item,sqlidx,paramnames);
                    sqlstr += str;
                    sqlidx = idx;
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
            if(name.trim().length>0) {
                results[name] = this.param(name);
            }
        }
        return results;
    }
    public getSQLOptions(db: KnDBConnector) : [KnSQLOptions, KnDBParam] {
        let [sql,paramnames] = this.getExactlySql(db.alias);
        let dbparam = this.getDBParam(paramnames);
        return [{ sql: sql, options: this.options }, dbparam];
    }
    public async executeQuery(db: KnDBConnector, ctx?: any, params?: Array<any>) : Promise<KnResultSet> {
        let span = this.createSpan(db,ctx);
        try {
            if(params) {
                let [sql] = this.getExactlySql(db.alias);
                return db.executeQuery({sql: sql, options: this.options}, params);
            }
            let [sqlopts,dbparam] = this.getSQLOptions(db);
            return db.executeQuery(sqlopts, dbparam);
        } finally {
            if(span) span.finish();
        }
    }
    public async executeUpdate(db: KnDBConnector, ctx?: any, params?: Array<any>) : Promise<KnResultSet> {
        let span = this.createSpan(db,ctx);
        try {
            if(params) {
                let [sql] = this.getExactlySql(db.alias);
                return db.executeUpdate({sql: sql, options: this.options}, params);
            }
            let [sqlopts,dbparam] = this.getSQLOptions(db);
            return db.executeUpdate(sqlopts, dbparam);
        } finally {
            if(span) span.finish();
        }
    }
    public createSpan(db: KnDBConnector, ctx?: any) : any {
        if(ctx?.startSpan) {
            let config = {...db.config};
            if(config.password) config.password = UNPRINTED;
            if(config.url) config.url = UNPRINTED;
            return ctx.startSpan(db.constructor.name,{tags: {sql: this.sql, config: config}});
        }
        return undefined;
    }
}
