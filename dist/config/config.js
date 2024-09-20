"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    development: {
        dialect: "sqlite",
        storage: "./datastore.sqlite",
        logging: false,
        attributeBehavior: "escape",
        benchmark: false
    },
    test: {
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
    },
    production: {
        dialect: "sqlite",
        storage: "./datastore.sqlite",
        logging: false,
    },
};
exports.default = config;
