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
exports.MsSQLDBConnection = void 0;
const mssql_1 = __importDefault(require("mssql"));
const DBConfig_1 = require("../DBConfig");
class MsSQLDBConnection {
    static initPool() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.pool) {
                let appool = new mssql_1.default.ConnectionPool(DBConfig_1.dbconfig.url);
                this.pool = yield appool.connect();
            }
        });
    }
    static getConnection(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initPool();
            if (transaction) {
                let request = transaction.request();
                request.transaction = transaction;
                return Promise.resolve(request);
            }
            return Promise.resolve(this.pool.request());
        });
    }
    static getTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initPool();
            return Promise.resolve(this.pool.transaction());
        });
    }
    static releaseConnection(conn) {
        try {
            if (conn) {
                conn.close((err) => {
                    if (err)
                        console.error(err);
                });
            }
        }
        catch (ex) {
            console.error(ex);
        }
    }
    static releasePool() {
        if (this.pool) {
            this.pool.close((err) => {
                //if(err) console.error(err);
            });
        }
    }
}
exports.MsSQLDBConnection = MsSQLDBConnection;
