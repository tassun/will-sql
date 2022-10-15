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
exports.OracleDBConnection = void 0;
const oracledb_1 = __importDefault(require("oracledb"));
const DBConfig_1 = require("../DBConfig");
class OracleDBConnection {
    static initPool() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.pool) {
                this.pool = yield oracledb_1.default.createPool({
                    user: DBConfig_1.dbconfig.user,
                    password: DBConfig_1.dbconfig.password,
                    connectionString: DBConfig_1.dbconfig.url
                });
            }
        });
    }
    static getConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initPool();
            return new Promise((resolve, reject) => {
                this.pool.getConnection((cerr, conn) => {
                    if (cerr) {
                        if (conn)
                            OracleDBConnection.releaseConnection(conn);
                        reject(cerr);
                    }
                    else {
                        resolve(conn);
                    }
                });
            });
        });
    }
    static releaseConnection(conn) {
        try {
            conn.close((cerr) => {
                if (cerr)
                    console.error("error", cerr);
            });
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
exports.OracleDBConnection = OracleDBConnection;
