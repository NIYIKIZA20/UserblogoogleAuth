import { Sequelize, Model, DataTypes } from "sequelize";

interface UserAttribute {
    id: string,
    name: string,
    email: string,
    gender: 'male' | 'female' | 'other'
    role: 'admin' | 'user'
    password: string
    googleId?: string
    profilePicture?: string
    provider?: string
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: null
    blogs?: any[];
    comments?: any[];
    likes?: any[];
}
export interface UserCreationAttribute extends Omit<UserAttribute, 'id' | 'role' | 'password'> {
    id?: string;
    role?: string;
    password?: string;
}

export class User extends Model<UserAttribute, UserCreationAttribute> implements UserAttribute {
    public id!: string;
    public email!: string;
    public password!: string;
    public googleId?: string;
    public profilePicture?: string;
    public provider?: string;
    public role!: 'admin' | 'user';
    public gender!: "male" | "female" | "other";
    public updatedAt!: Date;
    public deletedAt: null = null;
    public createdAt: Date = new Date;
    public name!: string;
    public blogs?: any[];
    public comments?: any[];
    public likes?: any[];

    static associate(models: any) {
        User.hasMany(models.Blog, {
            foreignKey: 'author',
            as: 'blogs'
        });
        
        User.hasMany(models.Comment, {
            foreignKey: 'author',
            as: 'comments'
        });
        
        User.hasMany(models.Like, {
            foreignKey: 'user',
            as: 'likes'
        });
    }
    
    public toJSON(): object | UserAttribute {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            password: this.password,
            gender: this.gender,
            role: this.role,
            updatedAt: this.updatedAt,
            createdAt: this.createdAt
        }
    }
}

export const UserModal = (sequelize: Sequelize) => {
    User.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true
        },
        googleId: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        profilePicture: {
            type: DataTypes.STRING,
            allowNull: true
        },
        provider: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'user',
            validate: {
                isIn: [['user', 'admin']]
            },
            allowNull: false
        },
        gender: {
            type: DataTypes.ENUM('male', 'female', 'other'),
            allowNull: false
        },
    }, {
        sequelize,
        timestamps: true,
        modelName: "User",
        tableName: 'users',
    })
    return User
}