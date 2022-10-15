"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLDBConnection = void 0;
const mysql_1 = __importDefault(require("mysql"));
const DBConfig_1 = require("../DBConfig");
class MySQLDBConnection {
    static initPool() {
        if (!this.pool) {
            this.pool = mysql_1.default.createPool(DBConfig_1.dbconfig.url);
        }
    }
    static getConnection() {
        this.initPool();
        return new Promise((resolve, reject) => {
            this.pool.getConnection((cerr, conn) => {
                if (cerr) {
                    if (conn)
                        MySQLDBConnection.releaseConnection(conn);
                    reject(cerr);
                }
                else {
                    resolve(conn);
                }
            });
        });
    }
    static getConnectionAsync(callback) {
        this.initPool();
        this.pool.getConnection((cerr, conn) => {
            if (cerr) {
                if (conn)
                    MySQLDBConnection.releaseConnection(conn);
                callback(cerr, null);
            }
            else {
                callback(null, conn);
            }
        });
    }
    static releaseConnection(conn) {
        try {
            let pconn = conn;
            pconn.release();
        }
        catch (ex) {
            console.error(ex);
        }
    }
    static releasePool() {
        if (this.pool) {
            this.pool.end((err) => {
                //if(err) console.error(err);
            });
        }
    }
}
exports.MySQLDBConnection = MySQLDBConnection;
