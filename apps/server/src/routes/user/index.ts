import express from 'express';
import passport from '../../services/passport-jwt-strategy';
import { body, query } from 'express-validator';

// controllers
import { UserController } from '../../controllers/user';
// validators
import { idValidator } from '../../middlewares/validators';
import { authMiddleware } from '../../middlewares';
import { validateValidationChainResult } from '../../middlewares/validators';
import { upload } from '../../config/multer';
import { validateDietary } from '../../middlewares/validators/dietary-validator';

export const userRouter = express.Router();

const passportMiddleware = passport.authenticate('jwt', { session: false });

// user
userRouter.get(
	'/id/:id',
	idValidator,
	validateValidationChainResult,
	UserController.get.byId
);

userRouter.get('/username/:username', UserController.get.byUsername);

userRouter.get(
	'/all',
	query('limit').optional().isInt({ min: 1, max: 10 }),
	validateValidationChainResult,
	UserController.get.all
);

userRouter.put(
	'/:id',
	// passportMiddleware,
	// authMiddleware,
	idValidator,
	body('name').optional().notEmpty().isString().isLowercase(),
	body('password').optional().notEmpty().isString(),
	body('location').optional().notEmpty().isString(),
	body('description').optional().notEmpty().isString(),
	body('email').optional().isEmail().notEmpty(),
	validateDietary,
	validateValidationChainResult,
	upload.single('avatar'),
	UserController.put.byId
);

userRouter.delete(
	'/id/:id',
	idValidator,
	validateValidationChainResult,
	passportMiddleware,
	authMiddleware,
	UserController.delete.ById
);
