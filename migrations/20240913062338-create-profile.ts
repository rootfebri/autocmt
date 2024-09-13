import { QueryInterface, DataTypes } from 'sequelize';

export default {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.createTable('profiles', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
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
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        });
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.dropTable('profiles');
    },
};
