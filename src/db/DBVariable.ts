import config from "will-util";
export const DB_SCHEMA = config.env("DB_SCHEMA","TESTDB");
export const DB_URL = config.env("DB_URL","");
export const DB_ALIAS = config.env("DB_ALIAS","mysql");
export const DB_DIALECT = config.env("DB_DIALECT","mysql");
export const DB_USER = config.env("DB_USER","");
export const DB_PASSWORD = config.env("DB_PASSWORD","");
