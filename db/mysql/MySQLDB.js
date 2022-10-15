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
const MySQLDBQuery_1 = require("./MySQLDBQuery");
const MySQLDBConnection_1 = require("./MySQLDBConnection");
const DBConnect_1 = require("../DBConnect");
class MySQLDB extends DBConnect_1.DBConnect {
    constructor(config, connection) {
        super("MYSQL", "mysql", config);
        this.connection = connection;
    }
    initConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connection == undefined || this.connection == null) {
                this.connection = yield MySQLDBConnection_1.MySQLDBConnection.getConnection();
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
            return yield MySQLDBQuery_1.MySQLDBQuery.executeQuery(this.connection, sql, params);
        });
    }
    executeUpdate(sql, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initConnection();
            return yield MySQLDBQuery_1.MySQLDBQuery.executeUpdate(this.connection, sql, params);
        });
    }
    beginWork() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initConnection();
            return yield MySQLDBQuery_1.MySQLDBQuery.beginWork(this.connection);
        });
    }
    commitWork() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initConnection();
            return yield MySQLDBQuery_1.MySQLDBQuery.commitWork(this.connection);
        });
    }
    rollbackWork() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initConnection();
            return yield MySQLDBQuery_1.MySQLDBQuery.rollbackWork(this.connection);
        });
    }
    close() {
        if (this.connection) {
            MySQLDBConnection_1.MySQLDBConnection.releaseConnection(this.connection);
        }
    }
    end() {
        MySQLDBConnection_1.MySQLDBConnection.releasePool();
    }
}
module.exports = MySQLDB;
