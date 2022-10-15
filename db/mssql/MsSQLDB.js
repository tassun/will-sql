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
const MsSQLDBQuery_1 = require("./MsSQLDBQuery");
const MsSQLDBConnection_1 = require("./MsSQLDBConnection");
const DBConnect_1 = require("../DBConnect");
class MsSQLDB extends DBConnect_1.DBConnect {
    constructor(config, connection) {
        super("MSSQL", "mssql", config);
        this.connection = connection;
    }
    initConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connection == undefined || this.connection == null) {
                this.connection = yield MsSQLDBConnection_1.MsSQLDBConnection.getConnection(this.transaction);
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
        this.transaction = undefined;
    }
    executeQuery(sql, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initConnection();
            return yield MsSQLDBQuery_1.MsSQLDBQuery.executeQuery(this.connection, sql, params);
        });
    }
    executeUpdate(sql, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initConnection();
            return yield MsSQLDBQuery_1.MsSQLDBQuery.executeUpdate(this.connection, sql, params);
        });
    }
    beginWork() {
        return __awaiter(this, void 0, void 0, function* () {
            this.reset();
            this.transaction = yield MsSQLDBConnection_1.MsSQLDBConnection.getTransaction();
            yield this.initConnection();
            return yield MsSQLDBQuery_1.MsSQLDBQuery.beginWork(this.connection);
        });
    }
    commitWork() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initConnection();
            try {
                return yield MsSQLDBQuery_1.MsSQLDBQuery.commitWork(this.connection);
            }
            finally {
                this.reset();
            }
        });
    }
    rollbackWork() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initConnection();
            try {
                return yield MsSQLDBQuery_1.MsSQLDBQuery.rollbackWork(this.connection);
            }
            finally {
                this.reset();
            }
        });
    }
    close() {
        if (this.connection) {
            MsSQLDBConnection_1.MsSQLDBConnection.releaseConnection();
        }
    }
    end() {
        MsSQLDBConnection_1.MsSQLDBConnection.releasePool();
    }
}
module.exports = MsSQLDB;
