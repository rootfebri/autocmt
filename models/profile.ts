import {DataTypes, Model} from "sequelize";
import {sequelize} from "./index";

class Profile extends Model {
    declare id: number;
    declare name: string;
    declare fullpath: string;
    declare twitter: boolean;
    declare facebook: boolean;
    declare instagram: boolean;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Profile.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        fullpath: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        twitter: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        facebook: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        instagram: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        tableName: "profiles",
    }
);

export default Profile;
