"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCamelCase = exports.toSnakeCase = exports.mapToCamelCase = exports.mapToSnakeCase = exports.BaseRepository = exports.KNEX_CONNECTION = exports.KnexModule = exports.createKnexInstance = void 0;
var datasource_1 = require("./datasource");
Object.defineProperty(exports, "createKnexInstance", { enumerable: true, get: function () { return datasource_1.createKnexInstance; } });
var knex_module_1 = require("./knex.module");
Object.defineProperty(exports, "KnexModule", { enumerable: true, get: function () { return knex_module_1.KnexModule; } });
Object.defineProperty(exports, "KNEX_CONNECTION", { enumerable: true, get: function () { return knex_module_1.KNEX_CONNECTION; } });
var base_repository_1 = require("./base.repository");
Object.defineProperty(exports, "BaseRepository", { enumerable: true, get: function () { return base_repository_1.BaseRepository; } });
Object.defineProperty(exports, "mapToSnakeCase", { enumerable: true, get: function () { return base_repository_1.mapToSnakeCase; } });
Object.defineProperty(exports, "mapToCamelCase", { enumerable: true, get: function () { return base_repository_1.mapToCamelCase; } });
Object.defineProperty(exports, "toSnakeCase", { enumerable: true, get: function () { return base_repository_1.toSnakeCase; } });
Object.defineProperty(exports, "toCamelCase", { enumerable: true, get: function () { return base_repository_1.toCamelCase; } });
//# sourceMappingURL=index.js.map