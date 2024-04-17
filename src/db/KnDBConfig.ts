export interface KnDBConfig {
    schema: string;
    alias: string,
    dialect: string;
    url: string;
    user: string;
    password: string;
    host?: string;
    port?: number;
    database?: string;
    options?: any;
}

export const dbconfig : KnDBConfig = {
    schema: "",
    alias: "",
    dialect: "",
    url: "",
    user: "",
    password: "",
}
