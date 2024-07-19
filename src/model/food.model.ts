import { BelongsToManyAddAssociationMixin, BelongsToManyAddAssociationsMixin, BelongsToManyCountAssociationsMixin, BelongsToManyCreateAssociationMixin, BelongsToManyGetAssociationsMixin, BelongsToManyHasAssociationMixin, BelongsToManyHasAssociationsMixin, BelongsToManyRemoveAssociationMixin, BelongsToManyRemoveAssociationsMixin, BelongsToManySetAssociationsMixin, CreationOptional, DataTypes, InitOptions, Model, ModelAttributes, NonAttribute, Sequelize } from "sequelize";
import { BaseModel } from "../util/common";
import { Order } from "./order.model";
import { OrderFood } from "./orderfood.model";

export class Food extends BaseModel {
    declare id: CreationOptional<bigint>;
    declare name: string;
    declare quantity: CreationOptional<number>;

    declare getOrderFoods: BelongsToManyGetAssociationsMixin<OrderFood>;
    declare addOrderFood: BelongsToManyAddAssociationMixin<OrderFood, bigint>;
    declare addOrderFoods: BelongsToManyAddAssociationsMixin<OrderFood, bigint>;
    declare setOrderFoods: BelongsToManySetAssociationsMixin<OrderFood, bigint>;
    declare removeOrderFood: BelongsToManyRemoveAssociationMixin<OrderFood, bigint>;
    declare removeOrderFoods: BelongsToManyRemoveAssociationsMixin<OrderFood, bigint>;
    declare hasOrderFood: BelongsToManyHasAssociationMixin<OrderFood, bigint>;
    declare hasOrderFoods: BelongsToManyHasAssociationsMixin<OrderFood, bigint>;
    declare countOrderFoods: BelongsToManyCountAssociationsMixin;
    declare createOrderFoods: BelongsToManyCreateAssociationMixin<OrderFood>;

    public associate() {
        Food.belongsToMany(Order, { through: OrderFood });
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
                    is: '[a-zA-Z]+[a-zA-Z\_\s]*[a-zA-Z]+', 
                }
            }, 
            quantity: {
                type: DataTypes.REAL, 
                allowNull: false, 
                defaultValue: 0, 
                validate: {
                    min: 0, 
                }
            }, 
        };
    }

    public getModelInitOptions(sequelize: Sequelize): InitOptions {
        return {
            sequelize: sequelize, 
            modelName: 'Foods', 
        };
    }
}
