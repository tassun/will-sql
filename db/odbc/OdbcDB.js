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
const OdbcDBQuery_1 = require("./OdbcDBQuery");
const OdbcDBConnection_1 = require("./OdbcDBConnection");
const DBConnect_1 = require("../DBConnect");
class OdbcDB extends DBConnect_1.DBConnect {
    constructor(dialect, config, connection) {
        super("ODBC", dialect, config);
        this.connection = connection;
    }
    initConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connection == undefined || this.connection == null) {
                this.connection = yield OdbcDBConnection_1.OdbcDBConnection.getConnection();
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
            return yield OdbcDBQuery_1.OdbcDBQuery.executeQuery(this.connection, sql, params);
        });
    }
    executeUpdate(sql, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initConnection();
            return yield OdbcDBQuery_1.OdbcDBQuery.executeUpdate(this.connection, sql, params);
        });
    }
    beginWork() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initConnection();
            return yield OdbcDBQuery_1.OdbcDBQuery.beginWork(this.connection);
        });
    }
    commitWork() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initConnection();
            return yield OdbcDBQuery_1.OdbcDBQuery.commitWork(this.connection);
        });
    }
    rollbackWork() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initConnection();
            return yield OdbcDBQuery_1.OdbcDBQuery.rollbackWork(this.connection);
        });
    }
    close() {
        if (this.connection) {
            OdbcDBConnection_1.OdbcDBConnection.releaseConnection(this.connection);
        }
    }
    end() {
        OdbcDBConnection_1.OdbcDBConnection.releasePool();
    }
}
module.exports = OdbcDB;
