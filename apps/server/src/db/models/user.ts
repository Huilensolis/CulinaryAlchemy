import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcrypt';

import { dbSequelize } from '../../config/db';
import { Role } from './roles';

import { UserInterface } from '../../interfaces/user.interface';

class User extends Model<UserInterface> implements UserInterface {
	id!: number;
	username!: string;
	email!: string;
	password!: string;
	avatar!: string;
	name!: string;
	description!: string;
	location!: string;
	dietaryPreferences!: string[];
	createdAt!: Date;
	updatedAt!: Date;
	deletedAt!: Date;
	isDeleted!: boolean;
	roleId!: number | null;
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
				len: [4, 254],
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [12, 60], // 60 characters is the hash generated by bcrypt
			},
		},
		avatar: {
			type: DataTypes.STRING,
			allowNull: true,
			// defaultValue: 'default profile picture url'
			validate: {
				isUrl: true,
			},
		},
		name: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		location: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		dietaryPreferences: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW(),
			validate: {
				isDate: true,
			},
		},
		updatedAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW(),
			validate: {
				isDate: true,
			},
		},
		deletedAt: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: null,
			validate: {
				isDate: true,
			},
		},
		isDeleted: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: true,
			validate: {
				isBoolean: true,
			},
		},
		roleId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'Roles', // Note that we are using the table name, not the model name
				key: 'id',
			},
		},
	},
	{
		sequelize: dbSequelize,
		modelName: 'Users',
	}
);

User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

User.beforeCreate(async (user: User) => {
	user.password = await bcrypt.hash(user.password, 10);
	console.log(user.password);
});

export { User };
