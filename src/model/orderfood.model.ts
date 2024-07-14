import { ModelAttributes, Model, DataTypes, InitOptions, Sequelize } from "sequelize";
import { BaseModel } from "../util/common";
import { Order } from "./order.model";
import { Food } from "./food.model";

export class OrderFood extends BaseModel {
    declare quantity: number;

    public associate() {
    }

    public getModelAttributes(): ModelAttributes<Model> {
        return {
            orderId: {
                type: DataTypes.BIGINT, 
                allowNull: false, 
                references: {
                    key: 'id', 
                    model: Order
                }
            }, 
            foodId: {
                type: DataTypes.BIGINT, 
                allowNull: false, 
                references: {
                    key: 'id', 
                    model: Food, 
                }
            }, 
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
            paranoid: true, 
            deletedAt: 'deleted_at', 
            modelName: 'OrderFood', 
        }
    }
}
