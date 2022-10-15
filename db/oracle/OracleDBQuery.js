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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OracleDBQuery = void 0;
const oracledb_1 = __importDefault(require("oracledb"));
const DBUtils_1 = require("../DBUtils");
class OracleDBQuery {
    static executeQuery(conn, query, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let sql = DBUtils_1.DBUtils.getQuery(query);
            let [parameters] = DBUtils_1.DBUtils.extractDBParam(params);
            let result = yield conn.execute(sql, parameters, {
                outFormat: oracledb_1.default.OUT_FORMAT_OBJECT
            });
            return Promise.resolve({ rows: result.rows, fields: result.metaData });
        });
    }
    static executeUpdate(conn, query, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let sql = DBUtils_1.DBUtils.getQuery(query);
            let [parameters] = DBUtils_1.DBUtils.extractDBParam(params);
            let result = yield conn.execute(sql, parameters, {
                outFormat: oracledb_1.default.OUT_FORMAT_OBJECT
            });
            return Promise.resolve({ rows: { affectedRows: result.rowsAffected }, fields: null });
        });
    }
    static beginWork(conn) {
        oracledb_1.default.autoCommit = false;
        return Promise.resolve();
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
exports.OracleDBQuery = OracleDBQuery;
