import { BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, CreationOptional, DataTypes, InitOptions, Model, ModelAttributes, Sequelize } from "sequelize";
import { BaseModel } from "../util/common";
import { Food } from "./food.model";
import { Order } from "./order.model";

/**
 * Represents an Event.
 */
export class Event extends BaseModel {
    declare id: CreationOptional<bigint>;
    declare user: string;
    declare quantity: number;

    declare createFood: BelongsToCreateAssociationMixin<Food>;
    declare getFood: BelongsToGetAssociationMixin<Food>;
    declare setFood: BelongsToSetAssociationMixin<Food, bigint>;

    declare createOrder: BelongsToCreateAssociationMixin<Order>;
    declare getOrder: BelongsToGetAssociationMixin<Order>;
    declare setOrder: BelongsToSetAssociationMixin<Order, bigint>;

    /**
     * Performs associations initialization for this model.
     */
    public associate(): void {
        Event.belongsTo(Food, { foreignKey: 'food' });
        Event.belongsTo(Order, {
            foreignKey: {
                name: 'order', 
                allowNull: true, 
            }
        });
    }

    /**
     * Gets the model attributes.
     * @returns Sequelize initialization model attributes
     */
    public getModelAttributes(): ModelAttributes<Model> {
        return {
            id: {
                type: DataTypes.BIGINT, 
                primaryKey: true, 
                autoIncrement: true, 
            }, 
            user: {
                type: DataTypes.STRING, 
                allowNull: false, 
                validate: {
                    isEmail: true, 
                }
            }, 
            quantity: {
                type: DataTypes.REAL, 
                allowNull: false, 
                validate: {
                    isPositive(x: number) {
                        if(x <= 0) {
                            throw new Error('quantity must be positive');
                        }
                    }
                }
            }
        };
    }

    /**
     * Gets the model initialization options.
     * @param sequelize - The database connection
     * @returns Sequelize model InitOptions
     */
    public getModelInitOptions(sequelize: Sequelize): InitOptions {
        return {
            sequelize: sequelize, 
            updatedAt: false, 
        };
    }
}
