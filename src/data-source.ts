import "reflect-metadata"
import { DataSource } from "typeorm"
import {Chrome} from "./entity/Chrome"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [Chrome],
    migrations: [],
    subscribers: [],
})
