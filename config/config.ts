import {Dialect, Options} from "sequelize";

interface IConfig {
    [key: string]: Options;
}

const config: IConfig = {
    development: {
        dialect: "sqlite" as Dialect,
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

export default config;
