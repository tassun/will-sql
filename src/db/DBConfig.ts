export interface DBConfig {
    alias: string,
    dialect: string;
    url: string;
    user: string;
    password: string;
    options?: any;
}

export const dbconfig : DBConfig = {
    alias: "",
    dialect: "",
    url: "",
    user: "",
    password: "",
}
