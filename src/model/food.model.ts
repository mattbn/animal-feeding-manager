import { CreationOptional, DataTypes, InitOptions, Model, ModelAttributes, Sequelize } from "sequelize";
import { BaseModel } from "../util/common";

export class Food extends BaseModel {
    declare id: CreationOptional<bigint>;
    declare name: string;
    declare quantity: CreationOptional<number>;

    public associate() {

    }

    public getModelAttributes(): ModelAttributes<Model> {
        return {
            id: {
                type: DataTypes.BIGINT, 
                primaryKey: true, 
                autoIncrement: true, 
                validate: {
                    isInt: true, 
                    min: 1, 
                }
            }, 
            name: {
                type: DataTypes.STRING, 
                allowNull: false, 
                unique: true, 
                validate: {
                    len: [2, 64], 
                    isAlpha: true, 
                }
            }, 
            quantity: {
                type: DataTypes.REAL, 
                allowNull: false, 
                defaultValue: 0, 
                validate: {
                    isFloat: true, 
                }
            }, 
        };
    }

    public getModelInitOptions(sequelize: Sequelize): InitOptions {
        return {
            sequelize: sequelize, 
            paranoid: true, 
            deletedAt: 'deleted_at', 
            defaultScope: {
                attributes: {
                    exclude: ['deleted_at'], 
                }
            }
        };
    }
}
