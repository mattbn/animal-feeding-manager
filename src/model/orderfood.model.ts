import { ModelAttributes, Model, DataTypes, InitOptions, Sequelize } from "sequelize";
import { BaseModel } from "../util/common";

export class OrderFood extends BaseModel {
    declare quantity: number;

    public associate() {
    }

    public getModelAttributes(): ModelAttributes<Model> {
        return {
            quantity: {
                type: DataTypes.REAL, 
                allowNull: false, 
                validate: {
                    isPositive(x: number) {
                        if(x <= 0) {
                            throw new Error('food quantity must be positive');
                        }
                    }
                }
            }, 
        };
    }

    public getModelInitOptions(sequelize: Sequelize): InitOptions {
        return {
            sequelize: sequelize, 
            modelName: 'OrderFoods', 
        }
    }
}
