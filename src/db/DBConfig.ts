export interface DBConfig {
    schema: string;
    alias: string,
    dialect: string;
    url: string;
    user: string;
    password: string;
    options?: any;
}

export const dbconfig : DBConfig = {
    schema: "",
    alias: "",
    dialect: "",
    url: "",
    user: "",
    password: "",
}
