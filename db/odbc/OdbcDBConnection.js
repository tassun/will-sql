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
exports.OdbcDBConnection = void 0;
const DBConfig_1 = require("../DBConfig");
const odbc = require("odbc");
class OdbcDBConnection {
    static initPool() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.pool) {
                this.pool = yield odbc.pool(DBConfig_1.dbconfig.url);
            }
        });
    }
    static getConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initPool();
            return yield this.pool.connect();
        });
    }
    static getConnectionAsync(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initPool();
            this.pool.connect((cerr, conn) => {
                if (cerr) {
                    callback(cerr, null);
                }
                else {
                    callback(null, conn);
                }
            });
        });
    }
    static releaseConnection(conn) {
        if (conn) {
            conn.close((err) => {
                if (err)
                    console.error(err);
            });
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
exports.OdbcDBConnection = OdbcDBConnection;
