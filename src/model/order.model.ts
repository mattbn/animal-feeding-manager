import { BelongsToManyAddAssociationMixin, BelongsToManyAddAssociationsMixin, BelongsToManyCountAssociationsMixin, BelongsToManyCreateAssociationMixin, BelongsToManyGetAssociationsMixin, BelongsToManyHasAssociationMixin, BelongsToManyHasAssociationsMixin, BelongsToManyRemoveAssociationMixin, BelongsToManyRemoveAssociationsMixin, BelongsToManySetAssociationsMixin, CreationOptional, DataTypes, InitOptions, Model, ModelAttributes, NonAttribute, Sequelize } from "sequelize";
import { applyEnumFunction, BaseModel } from "../util/common";
import { Food } from "./food.model";
import { OrderFood } from "./orderfood.model";

export enum OrderStatus {
    Created, 
    Running, 
    Failed, 
    Completed, 
}

export class Order extends BaseModel {
    declare id: CreationOptional<bigint>;
    declare owner: string;
    declare status: CreationOptional<OrderStatus>;
    declare msg: string | null;

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

    public associate(): void {
        Order.belongsToMany(Food, { through: OrderFood });
    }

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
                    isAlphanumeric: true, 
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
                defaultValue: undefined, 
            }
        };
    }

    public getModelInitOptions(sequelize: Sequelize): InitOptions {
        return {
            sequelize: sequelize, 
            paranoid: true, 
            deletedAt: 'deleted_at', 
            modelName: 'Orders', 
        }
    }
}
