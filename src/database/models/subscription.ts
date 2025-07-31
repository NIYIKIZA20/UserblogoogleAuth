import { Sequelize, Model, DataTypes } from "sequelize";

interface SubscriptionAttribute {
    id: string;
    email: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface SubscriptionCreationAttribute extends Omit<SubscriptionAttribute, 'id'> {
    id?: string;
}
export class Subscription extends Model<SubscriptionAttribute, SubscriptionCreationAttribute> implements SubscriptionAttribute {
    public id!: string;
    public email!: string;
    public isActive!: boolean;
    public createdAt!: Date;
    public updatedAt!: Date;
    public toJSON(): object | SubscriptionAttribute {
        const values = Object.assign({}, this.get());
        return values;
    }
}
export const SubscriptionModel = (sequelize: Sequelize) => {
    Subscription.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        sequelize,
        timestamps: true,
        modelName: "Subscription",
        tableName: 'subscriptions'
    });
    
    return Subscription;
};