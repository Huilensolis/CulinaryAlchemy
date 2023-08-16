import { Request, Response } from 'express';

import { UserProvider } from '../../providers/user';
import { sendApiError, sendApiResponse } from '../../utils/index';
import { HttpStatusCodes } from '../../utils';
import { cleanObjectKeys, getObjectKeys } from '../../utils/object.utils';
import { cloudinaryService } from '../../services';

const UserController = {
	delete: {
		ById: async (req: Request, res: Response) => {
			const { id } = req.params;

			try {
				await UserProvider.deleteUser(id);
				return sendApiResponse(res, HttpStatusCodes.SUCCESS, null);
			} catch (error) {
				return sendApiError(res, HttpStatusCodes.NOT_FOUND);
			}
		},
	},
	get: {
		all: async (req: Request, res: Response) => {
			const { limit, offset } = req.query;
			let finalLimit;
			let finalOffset;
			limit ? (finalLimit = parseInt(limit as string)) : (finalLimit = 10);
			offset ? (finalOffset = parseInt(offset as string)) : (finalOffset = 0);
			try {
				const users = await UserProvider.getUser.All({
					limit: finalLimit,
					offset: finalOffset,
				});
				return sendApiResponse(res, HttpStatusCodes.SUCCESS, users);
			} catch (error) {
				return sendApiError(res, HttpStatusCodes.NOT_FOUND);
			}
		},
		byEmail: async (req: Request, res: Response) => {
			const { email } = req.body;
			try {
				const user = await UserProvider.getUser.ByEmail(email);
				if (!user) {
					return sendApiError(res, HttpStatusCodes.NOT_FOUND);
				}

				sendApiResponse(res, HttpStatusCodes.SUCCESS, user);
			} catch (error) {
				sendApiError(res, HttpStatusCodes.NOT_FOUND);
			}
		},
		byId: async (req: Request, res: Response) => {
			const { id } = req.params;
			try {
				const user = await UserProvider.getUser.ById(id);
				if (!user) {
					return sendApiError(res, HttpStatusCodes.NOT_FOUND);
				}

				sendApiResponse(res, HttpStatusCodes.SUCCESS, user);
			} catch (error) {
				return sendApiError(res, HttpStatusCodes.NOT_FOUND);
			}
		},
		byUsername: async (req: Request, res: Response) => {
			const { username } = req.params;
			try {
				const user = await UserProvider.getUser.ByUsername(username);
				if (!user) {
					return sendApiError(res, HttpStatusCodes.NOT_FOUND);
				}

				sendApiResponse(res, HttpStatusCodes.SUCCESS, user);
			} catch (error) {
				sendApiError(res, HttpStatusCodes.NOT_FOUND);
			}
		},
	},
	put: {
		byId: async (req: Request, res: Response) => {
			interface Params {
				username: string;
				name: string;
				avatar?: string;
				email: string;
				password: string;
				location: string;
				description: string;
				dietary: string[]
			}
			const { id } = req.params;
			const { username, name, email, password, location, description, dietary } =
				req.body;
			const avatar = req.file;
			const params: Params = {
				username,
				name,
				email,
				password,
				location,
				description,
				dietary
			};

			const requestParamsLength = getObjectKeys(params);

			if (requestParamsLength <= 0) {
				return sendApiError(
					res,
					HttpStatusCodes.BAD_REQUEST,
					'no params provided',
					null
				);
			}
			try {
				if (avatar) {
					const avatarUrl = await cloudinaryService.uploadImage(avatar!);
					params.avatar = avatarUrl;
				}
				const finalParams = cleanObjectKeys(params);
				await UserProvider.updateUser(id, { ...finalParams });

				return sendApiResponse(res, HttpStatusCodes.CREATED, null);
			} catch (error) {
				console.log(error);
				return sendApiError(res, HttpStatusCodes.INTERNAL_SERVER_ERROR);
			}
		},
	},
};
export { UserController };
