import dotenv from "dotenv";
dotenv.config();
import { Sequelize } from "sequelize";
import * as api from "./api";
import * as db from "./db";

(async () => {
    // init database
    let connection = new db.DbConnection('postgres')
        .addUsername(process.env.DB_USERNAME || 'postgres')
        .addPassword(process.env.DB_PASSWORD || 'password')
        .addHost(process.env.DB_HOST || 'localhost')
        .addPort(Number.parseInt(process.env.DB_PORT || '5432'))
        .addDatabase(process.env.DB_DATABASE || 'postgres')
        .addDefine({
            createdAt: 'created_at', 
            updatedAt: 'updated_at', 
            deletedAt: 'deleted_at', 
            paranoid: true, 
        })
        .create()
        .getConnection();

    // init models
    db.initModels(<Sequelize> connection);
    try {
        await db.syncModels(<Sequelize> connection, { force: true });
    }
    catch(err) {
        console.log(err);
        return;
    }

    // init api
    api.init(Number.parseInt(process.env.API_PORT || '8000'), console.log);
})();
