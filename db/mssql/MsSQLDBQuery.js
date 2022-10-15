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
exports.MsSQLDBQuery = void 0;
const DBUtils_1 = require("../DBUtils");
class MsSQLDBQuery {
    static assignParameters(conn, params) {
        if (params) {
            for (let p in params) {
                let pv = params[p];
                conn.input(p, pv.value);
            }
        }
    }
    static executeQuery(conn, query, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let sql = DBUtils_1.DBUtils.getQuery(query);
            this.assignParameters(conn, params);
            let result = yield conn.query(sql);
            return Promise.resolve({ rows: result.recordset, fields: null });
        });
    }
    static executeUpdate(conn, query, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let sql = DBUtils_1.DBUtils.getQuery(query);
            this.assignParameters(conn, params);
            let result = yield conn.query(sql);
            return Promise.resolve({ rows: { affectedRows: result.rowsAffected[0] }, fields: null });
        });
    }
    static beginWork(conn) {
        return new Promise((resolve, reject) => {
            conn.transaction.begin(undefined, (err) => {
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
            conn.transaction.commit((err) => {
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
            conn.transaction.rollback((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
}
exports.MsSQLDBQuery = MsSQLDBQuery;
