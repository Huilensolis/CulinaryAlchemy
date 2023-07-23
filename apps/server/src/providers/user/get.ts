import { User } from '../../db/models';

export const getUser = {
	ById: async (id: string) => {
		return new Promise(async (resolve, reject) => {
			try {
				const user = await User.findOne({
					where: {
						id: id,
						isDeleted: false,
					},
				});
				if (!user) {
					reject('user not found');
				}
				resolve({ user });
			} catch (error) {
				reject({ error });
			}
		});
	},
	ByEmail: async (email: string) => {
		return new Promise(async (resolve, reject) => {
			const user = await User.findOne({
				where: {
					email: email,
					isDeleted: false,
				},
			});

			if (!user) {
				reject('user not found');
			}
			resolve({ user });
		});
	},
	ByUsername: async (username: string) => {
		return new Promise(async (resolve, reject) => {
			try {
				const user = await User.findOne({
					where: {
						username: username,
						isDeleted: false,
					},
				});

				if (!user) {
					reject('user not found');
				}

				resolve({ user });
			} catch (error) {
				reject({ error });
			}
		});
	},
	All: async (limit: number) => {
		return new Promise(async (resolve, reject) => {
			try {
				const users = await User.findAll({
					limit: limit,
					where: {
						isDeleted: false,
					},
				});
				if (!users) {
					reject('users not found');
				}
				resolve({ users });
			} catch (error) {
				reject({ error });
			}
		});
	},
};
