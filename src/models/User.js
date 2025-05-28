import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/database.js';

class User extends Model { }

User.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: true },
    lastName: { type: DataTypes.STRING, allowNull: true },
    fullName: { type: DataTypes.STRING, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    location: { type: DataTypes.STRING, allowNull: true },
    address: { type: DataTypes.TEXT, allowNull: true },
    citizenship: { type: DataTypes.STRING, allowNull: true },
    ethnicity: { type: DataTypes.STRING, allowNull: true },
    gender: { type: DataTypes.STRING, allowNull: true },
    pronouns: { type: DataTypes.STRING, allowNull: true },
    veteran: { type: DataTypes.STRING, allowNull: true },
    resume: { type: DataTypes.STRING, allowNull: true, validate: { isUrl: true } },
    github: { type: DataTypes.STRING, allowNull: true, validate: { isUrl: true } },
    linkedin: { type: DataTypes.STRING, allowNull: true, validate: { isUrl: true } },
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false,
});

export default User;