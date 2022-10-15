"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBUtils = void 0;
const Utilities_1 = require("../utils/Utilities");
const DBAlias_1 = require("./DBAlias");
class DBUtils {
    static parseDBTypes(type) {
        if (typeof type === "string") {
            if (Utilities_1.Utilities.equalsIgnoreCase(type, "INTEGER") || Utilities_1.Utilities.equalsIgnoreCase(type, "NUMBER"))
                return DBAlias_1.DBTypes.INTEGER;
            if (Utilities_1.Utilities.equalsIgnoreCase(type, "DECIMAL"))
                return DBAlias_1.DBTypes.DECIMAL;
            if (Utilities_1.Utilities.equalsIgnoreCase(type, "BOOLEAN"))
                return DBAlias_1.DBTypes.BOOLEAN;
            if (Utilities_1.Utilities.equalsIgnoreCase(type, "BIGINT"))
                return DBAlias_1.DBTypes.BIGINT;
            if (Utilities_1.Utilities.equalsIgnoreCase(type, "TEXT"))
                return DBAlias_1.DBTypes.TEXT;
            if (Utilities_1.Utilities.equalsIgnoreCase(type, "DATE"))
                return DBAlias_1.DBTypes.DATE;
            if (Utilities_1.Utilities.equalsIgnoreCase(type, "TIME"))
                return DBAlias_1.DBTypes.TIME;
            if (Utilities_1.Utilities.equalsIgnoreCase(type, "DATETIME"))
                return DBAlias_1.DBTypes.DATETIME;
            if (Utilities_1.Utilities.equalsIgnoreCase(type, "BLOB"))
                return DBAlias_1.DBTypes.BLOB;
            if (Utilities_1.Utilities.equalsIgnoreCase(type, "CLOB"))
                return DBAlias_1.DBTypes.CLOB;
            return DBAlias_1.DBTypes.STRING;
        }
        else {
            return type;
        }
    }
    static parseDBAlias(alias) {
        if (typeof alias === "string") {
            if (Utilities_1.Utilities.equalsIgnoreCase("MYSQL", alias))
                return DBAlias_1.DBAlias.MYSQL;
            if (Utilities_1.Utilities.equalsIgnoreCase("MSSQL", alias))
                return DBAlias_1.DBAlias.MSSQL;
            if (Utilities_1.Utilities.equalsIgnoreCase("ODBC", alias))
                return DBAlias_1.DBAlias.ODBC;
            if (Utilities_1.Utilities.equalsIgnoreCase("ORACLE", alias))
                return DBAlias_1.DBAlias.ORACLE;
            return DBAlias_1.DBAlias.MYSQL;
        }
        else {
            return alias;
        }
    }
    static parseSQLOptions(query) {
        if (typeof query === "string") {
            return undefined;
        }
        else {
            return query;
        }
    }
    static getQuery(query) {
        if (typeof query === "string") {
            return query;
        }
        else {
            return query.sql;
        }
    }
    static extractDBParam(params) {
        let paravalues = [];
        let paranames = [];
        let paratypes = [];
        if (params) {
            for (let p in params) {
                let pv = params[p];
                paranames.push(p);
                paravalues.push(pv.value);
                paratypes.push(pv.type);
            }
        }
        return [paravalues, paranames, paratypes];
    }
}
exports.DBUtils = DBUtils;
