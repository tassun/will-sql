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
const OracleDBQuery_1 = require("./OracleDBQuery");
const OracleDBConnection_1 = require("./OracleDBConnection");
const DBConnect_1 = require("../DBConnect");
class OracleDB extends DBConnect_1.DBConnect {
    constructor(config, connection) {
        super("ORACLE", "oracle", config);
        this.connection = connection;
    }
    initConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connection == undefined || this.connection == null) {
                this.connection = yield OracleDBConnection_1.OracleDBConnection.getConnection();
            }
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initConnection();
        });
    }
    reset() {
        this.connection = undefined;
    }
    executeQuery(sql, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initConnection();
            return yield OracleDBQuery_1.OracleDBQuery.executeQuery(this.connection, sql, params);
        });
    }
    executeUpdate(sql, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initConnection();
            return yield OracleDBQuery_1.OracleDBQuery.executeUpdate(this.connection, sql, params);
        });
    }
    beginWork() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initConnection();
            return yield OracleDBQuery_1.OracleDBQuery.beginWork(this.connection);
        });
    }
    commitWork() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initConnection();
            return yield OracleDBQuery_1.OracleDBQuery.commitWork(this.connection);
        });
    }
    rollbackWork() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initConnection();
            return yield OracleDBQuery_1.OracleDBQuery.rollbackWork(this.connection);
        });
    }
    close() {
        if (this.connection) {
            OracleDBConnection_1.OracleDBConnection.releaseConnection(this.connection);
        }
    }
    end() {
        OracleDBConnection_1.OracleDBConnection.releasePool();
    }
}
module.exports = OracleDB;
