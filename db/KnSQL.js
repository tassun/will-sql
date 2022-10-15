"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnSQL = void 0;
const StringTokenizer_1 = require("../utils/StringTokenizer");
const DBAlias_1 = require("./DBAlias");
const DBUtils_1 = require("./DBUtils");
const DBError_1 = require("./DBError");
class KnSQL {
    constructor(sql = "", options) {
        this.params = new Map();
        this.sql = sql;
        this.options = options;
    }
    clear() {
        this.sql = "";
        this.params.clear();
    }
    append(sql) {
        this.sql += sql;
        return this;
    }
    set(paramname, paramvalue, paramtype = DBAlias_1.DBTypes.STRING) {
        if (paramvalue === null) {
            this.params.set(paramname, new DBAlias_1.DBParamValue(paramvalue, DBUtils_1.DBUtils.parseDBTypes(paramtype)));
        }
        else if (paramvalue instanceof DBAlias_1.DBParamValue) {
            this.params.set(paramname, paramvalue);
        }
        else if (paramvalue instanceof Date) {
            this.params.set(paramname, new DBAlias_1.DBParamValue(paramvalue, DBUtils_1.DBUtils.parseDBTypes(paramtype)));
        }
        else {
            if (typeof paramvalue === "string") {
                this.params.set(paramname, new DBAlias_1.DBParamValue(paramvalue, DBUtils_1.DBUtils.parseDBTypes(paramtype)));
            }
            else if (typeof paramvalue === "number") {
                this.params.set(paramname, new DBAlias_1.DBParamValue(paramvalue, DBUtils_1.DBUtils.parseDBTypes(paramtype)));
            }
            else if (typeof paramvalue === "boolean") {
                this.params.set(paramname, new DBAlias_1.DBParamValue(paramvalue, DBAlias_1.DBTypes.BOOLEAN));
            }
            else if (typeof paramvalue === "bigint") {
                this.params.set(paramname, new DBAlias_1.DBParamValue(paramvalue, DBAlias_1.DBTypes.BIGINT));
            }
            else if (typeof paramvalue === "undefined") {
                this.params.set(paramname, new DBAlias_1.DBParamValue(paramvalue, DBUtils_1.DBUtils.parseDBTypes(paramtype)));
            }
        }
        return this;
    }
    param(name) {
        let result = this.params.get(name);
        if (!result)
            throw new DBError_1.DBError("Parameter '" + name + "' not found", -10101);
        return result;
    }
    getExactlySql(alias = DBAlias_1.DBAlias.MYSQL) {
        let dbalias = DBUtils_1.DBUtils.parseDBAlias(alias);
        let odbc = dbalias == DBAlias_1.DBAlias.ODBC;
        let mysql = dbalias == DBAlias_1.DBAlias.MYSQL;
        let mssql = dbalias == DBAlias_1.DBAlias.MSSQL;
        let oracle = dbalias == DBAlias_1.DBAlias.ORACLE;
        let sqlstr = "";
        let paramnames = [];
        let tok = new StringTokenizer_1.StringTokenizer(this.sql, "?), \n", true);
        let it = tok.iterator();
        while (it.hasNext()) {
            let element = it.next();
            if ("?" == element) {
                sqlstr += (mysql || odbc ? "?" : (mssql ? "@" : (oracle ? ":" : element)));
                if (it.hasNext()) {
                    let item = it.next();
                    if (!(" " == item) && !(")" == item) && !("," == item) && !("\n" == item)) {
                        paramnames.push(item);
                        if (mssql || oracle)
                            sqlstr += item;
                    }
                    else {
                        sqlstr += item;
                    }
                }
            }
            else {
                sqlstr += element;
            }
        }
        return [sqlstr, paramnames];
    }
    parameters(names) {
        let results = [];
        for (let name of names) {
            let pr = this.param(name);
            if (pr) {
                results.push(pr.value);
            }
            else {
                results.push(undefined);
            }
        }
        ;
        return results;
    }
    getDBParam(names) {
        let results = {};
        for (let name of names) {
            results[name] = this.param(name);
        }
        return results;
    }
    executeQuery(db) {
        return __awaiter(this, void 0, void 0, function* () {
            let [sql, paramnames] = this.getExactlySql(db.alias);
            let dbparam = this.getDBParam(paramnames);
            return db.executeQuery({ sql: sql, options: this.options }, dbparam);
        });
    }
    executeUpdate(db) {
        return __awaiter(this, void 0, void 0, function* () {
            let [sql, paramnames] = this.getExactlySql(db.alias);
            let dbparam = this.getDBParam(paramnames);
            return db.executeUpdate({ sql: sql, options: this.options }, dbparam);
        });
    }
}
exports.KnSQL = KnSQL;
