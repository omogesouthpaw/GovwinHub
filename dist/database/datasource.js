"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createKnexInstance = createKnexInstance;
const knex_1 = require("knex");
function createKnexInstance(options) {
    return (0, knex_1.default)({
        client: 'mysql2',
        connection: {
            host: options.host,
            port: options.port,
            user: options.user,
            password: options.password,
            database: options.database,
            charset: 'utf8mb4',
        },
        pool: {
            min: 2,
            max: 10,
        },
    });
}
//# sourceMappingURL=datasource.js.map