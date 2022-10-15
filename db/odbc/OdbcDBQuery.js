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
exports.OdbcDBQuery = void 0;
const DBUtils_1 = require("../DBUtils");
class OdbcDBQuery {
    static removeAttributes(rows) {
        const fieldnames = ["statement", "parameters", "return", "count", "columns"];
        fieldnames.forEach(function (name) {
            if (rows.hasOwnProperty(name)) {
                delete rows[name];
            }
        });
    }
    static executeQuery(conn, query, params) {
        let sql = DBUtils_1.DBUtils.getQuery(query);
        let [parameters] = DBUtils_1.DBUtils.extractDBParam(params);
        return new Promise((resolve, reject) => {
            conn.query(sql, parameters, (qerr, rows) => {
                if (qerr) {
                    reject(qerr);
                }
                else {
                    let columns = rows.columns;
                    this.removeAttributes(rows);
                    resolve({ rows: rows, fields: columns });
                }
            });
        });
    }
    static executeUpdate(conn, query, params) {
        let sql = DBUtils_1.DBUtils.getQuery(query);
        let [parameters] = DBUtils_1.DBUtils.extractDBParam(params);
        return new Promise((resolve, reject) => {
            conn.query(sql, parameters, (qerr, rows) => {
                if (qerr) {
                    reject(qerr);
                }
                else {
                    let count = rows.count;
                    let columns = rows.columns;
                    resolve({ rows: { affectedRows: count }, fields: columns });
                }
            });
        });
    }
    static statementQuery(conn, query, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let sql = DBUtils_1.DBUtils.getQuery(query);
            let [parameters] = DBUtils_1.DBUtils.extractDBParam(params);
            const stm = yield conn.createStatement();
            yield stm.prepare(sql);
            yield stm.bind(parameters);
            const rows = yield stm.execute();
            let columns = rows.columns;
            this.removeAttributes(rows);
            return Promise.resolve({ rows: rows, fields: columns });
        });
    }
    static statementUpdate(conn, query, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let sql = DBUtils_1.DBUtils.getQuery(query);
            let [parameters] = DBUtils_1.DBUtils.extractDBParam(params);
            const stm = yield conn.createStatement();
            yield stm.prepare(sql);
            yield stm.bind(parameters);
            const rows = yield stm.execute();
            let count = rows.count;
            let columns = rows.columns;
            return Promise.resolve({ rows: { affectedRows: count }, fields: columns });
        });
    }
    static beginWork(conn) {
        return new Promise((resolve, reject) => {
            conn.beginTransaction((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
    static commitWork(conn) {
        return new Promise((resolve, reject) => {
            conn.commit((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
    static rollbackWork(conn) {
        return new Promise((resolve, reject) => {
            conn.rollback((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
}
exports.OdbcDBQuery = OdbcDBQuery;
