"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_PASSWORD = exports.DB_USER = exports.DB_DIALECT = exports.DB_ALIAS = exports.DB_URL = void 0;
exports.DB_URL = process.env.DB_URL || "mysql://root:root@localhost:3306/basedb?charset=utf8&connectionLimit=10";
exports.DB_ALIAS = process.env.DB_ALIAS || "mysql";
exports.DB_DIALECT = process.env.DB_DIALECT || "mysql";
exports.DB_USER = process.env.DB_USER || "";
exports.DB_PASSWORD = process.env.DB_PASSWORD || "";
