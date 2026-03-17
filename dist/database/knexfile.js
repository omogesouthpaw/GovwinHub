"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const path = require("path");
const baseConfig = {
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'govwinhub',
        charset: 'utf8mb4',
    },
    migrations: {
        directory: path.resolve(__dirname, 'migrations'),
        extension: 'ts',
    },
    seeds: {
        directory: path.resolve(__dirname, 'seeds'),
        extension: 'ts',
    },
};
const config = {
    development: {
        ...baseConfig,
        pool: { min: 2, max: 10 },
    },
    production: {
        ...baseConfig,
        pool: { min: 2, max: 20 },
    },
    test: {
        ...baseConfig,
        connection: {
            ...baseConfig.connection,
            database: process.env.DB_NAME_TEST || 'govwinhub_test',
        },
        pool: { min: 1, max: 5 },
    },
};
module.exports = config[process.env.NODE_ENV || 'development'];
//# sourceMappingURL=knexfile.js.map