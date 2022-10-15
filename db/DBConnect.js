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
exports.DBConnect = void 0;
const DBUtils_1 = require("./DBUtils");
class DBConnect {
    constructor(alias, dialect, config) {
        this.alias = DBUtils_1.DBUtils.parseDBAlias(alias);
        this.dialect = dialect;
        this.config = config;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            //do nothing
        });
    }
    executeQuery(sql, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.reject(null);
        });
    }
    executeUpdate(sql, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.reject(null);
        });
    }
    beginWork() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.reject();
        });
    }
    commitWork() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.reject();
        });
    }
    rollbackWork() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.reject();
        });
    }
    reset() {
        //do nothing
    }
    /* close connection */
    close() {
        //do nothing
    }
    /* end pool */
    end() {
        //do nothing
    }
}
exports.DBConnect = DBConnect;
