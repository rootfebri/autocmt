import { Sequelize } from "sequelize";
import config from "../config/config";

const env = process.env.NODE_ENV || "development";
const sequelizeConfig = config[env];

const sequelize = new Sequelize(sequelizeConfig);

export { sequelize };
