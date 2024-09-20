"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config/config"));
const node_process_1 = __importDefault(require("node:process"));
const env = node_process_1.default.env.NODE_ENV || "development";
const sequelizeConfig = config_1.default[env];
const sequelize = new sequelize_1.Sequelize(sequelizeConfig);
exports.sequelize = sequelize;
