import { BelongsToManyAddAssociationMixin, BelongsToManyAddAssociationsMixin, BelongsToManyCountAssociationsMixin, BelongsToManyCreateAssociationMixin, BelongsToManyGetAssociationsMixin, BelongsToManyHasAssociationMixin, BelongsToManyHasAssociationsMixin, BelongsToManyRemoveAssociationMixin, BelongsToManyRemoveAssociationsMixin, BelongsToManySetAssociationsMixin, CreationOptional, DataTypes, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, InitOptions, Model, ModelAttributes, NonAttribute, Sequelize } from "sequelize";
import { applyEnumFunction, BaseModel } from "../util/common";
import { Food } from "./food.model";
import { OrderFood } from "./orderfood.model";
import { Event } from "./event.model";

/**
 * Contains Order statuses.
 */
export enum OrderStatus {
    Created, 
    Running, 
    Failed, 
    Completed, 
}

/**
 * Contains Order error messages.
 */
export enum ErrorMessage {
    InvalidLoadedQuantity = 'loaded quantity is too low or too high for some foods', 
    InvalidLoadSequence = 'load sequence was not respected', 
}

/**
 * Represents an Order.
 */
export class Order extends BaseModel {
    declare id: CreationOptional<bigint>;
    declare owner: string;
    declare status: CreationOptional<OrderStatus>;
    declare msg: CreationOptional<ErrorMessage>;

    declare getFoods: BelongsToManyGetAssociationsMixin<Food>;
    declare addFood: BelongsToManyAddAssociationMixin<Food, bigint>;
    declare addFoods: BelongsToManyAddAssociationsMixin<Food, bigint>;
    declare setFoods: BelongsToManySetAssociationsMixin<Food, bigint>;
    declare removeFood: BelongsToManyRemoveAssociationMixin<Food, bigint>;
    declare removeFoods: BelongsToManyRemoveAssociationsMixin<Food, bigint>;
    declare hasFood: BelongsToManyHasAssociationMixin<Food, bigint>;
    declare hasFoods: BelongsToManyHasAssociationsMixin<Food, bigint>;
    declare countFoods: BelongsToManyCountAssociationsMixin;
    declare createFoods: BelongsToManyCreateAssociationMixin<Food>;

    declare getEvents: HasManyGetAssociationsMixin<Event>;
    declare addEvent: HasManyAddAssociationMixin<Event, bigint>;
    declare addEvents: HasManyAddAssociationsMixin<Event, bigint>;
    declare setEvents: HasManySetAssociationsMixin<Event, bigint>;
    declare removeEvent: HasManyRemoveAssociationMixin<Event, bigint>;
    declare removeEvents: HasManyRemoveAssociationsMixin<Event, bigint>;
    declare hasEvent: HasManyHasAssociationMixin<Event, bigint>;
    declare hasEvents: HasManyHasAssociationsMixin<Event, bigint>;
    declare countEvents: HasManyCountAssociationsMixin;
    declare createEvents: HasManyCreateAssociationMixin<Event>;

    /**
     * Performs associations initialization for this model.
     */
    public associate(): void {
        Order.belongsToMany(Food, {
            through: OrderFood, 
            foreignKey: 'orderId', 
        });
        Order.hasMany(Event, {
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
            owner: {
                type: DataTypes.STRING, 
                allowNull: false, 
                validate: {
                    isEmail: true, 
                }
            }, 
            status: {
                type: DataTypes.INTEGER, 
                allowNull: false, 
                defaultValue: applyEnumFunction(OrderStatus, Math.min), 
                validate: {
                    min: applyEnumFunction(OrderStatus, Math.min), 
                    max: applyEnumFunction(OrderStatus, Math.max), 
                }
            }, 
            msg: {
                type: DataTypes.STRING, 
                allowNull: true, 
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
            modelName: 'Orders', 
        }
    }
}
