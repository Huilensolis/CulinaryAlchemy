import { sequelize } from '../../database/database.connection';
import { RecipeInterface, ImageInterface } from '../../interfaces';
import { MealType, Recipe, Image, Dietary } from '../../models';
import { MealTypeXRecipe, RecipeXDietary } from '../../models/shared';

const get = {
	byId: async (id: number) => {
		try {
			const recipe = await Recipe.findByPk(id, {
				include: [
					{ model: Image, as: 'images' },
					{ model: Dietary },
					{ model: MealType },
				],
			});
			return Promise.resolve(recipe);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	all: async (limit: number = 10, offset: number = 0) => {
		try {
			const recipes = await Recipe.findAll({
				where: { end_date: null },
				limit: limit,
				offset: offset,
				include: [
					{ model: Image, as: 'images' },
					{ model: Dietary },
					{ model: MealType },
				],
			});
			return Promise.resolve(recipes);
		} catch (error) {
			return Promise.reject(error);
		}
	},
};
const post = async (
	recipe: RecipeInterface,
	imagesUrls?: ImageInterface[],
	mealTypeIds?: number[],
	dietaryIds?: number[]
) => {
	const {
		cooking_time,
		description,
		equipment_needed,
		ingredients,
		servings,
		steps,
		title,
		user_id,
		authors_notes,
		spices,
		youtube_link,
	} = recipe;

	const t = await sequelize.transaction();

	try {
		// create recipe
		const newRecipe = Recipe.build({
			user_id,
			title,
			description,
			cooking_time,
			equipment_needed,
			ingredients,
			servings,
			steps: steps ? JSON.stringify(steps) : null,
			authors_notes,
			spices,
			youtube_link,
		});

		await newRecipe.save({ transaction: t });

		// create an image register (the database model) and set owner id to recipe id
		if (imagesUrls) {
			for (const image of imagesUrls) {
				await Image.create(
					{
						default_url: image.default_url,
						blur_url: image.blur_url,
						owner_id: newRecipe.id,
					},
					{ transaction: t }
				);
			}
		}

		// associate it with a meal type
		if (mealTypeIds) {
			for (const id of mealTypeIds) {
				const doesMealtypeExist = await MealType.findByPk(id);

				if (!doesMealtypeExist) {
					throw new Error(
						'One of the mealTypeIds doesnt exist. mealType id not existing: ' +
							id
					);
				}

				await MealTypeXRecipe.create(
					{ meal_type_id: id, recipe_id: newRecipe.id },
					{ transaction: t }
				);
			}
		}
		// associate it with a dietary
		if (dietaryIds) {
			for (const id of dietaryIds) {
				const doesDietaryIds = await MealType.findByPk(id);

				if (!doesDietaryIds) {
					throw new Error(
						'One of the dietariesIds doesnt exist. Dietary id not existing: ' +
							id
					);
				}

				await RecipeXDietary.create(
					{ dietary_id: id, recipe_id: newRecipe.id },
					{ transaction: t }
				);
			}
		}

		await t.commit();

		return Promise.resolve(newRecipe);
	} catch (error) {
		await t.rollback();

		return Promise.reject(
			new Error(
				`There is been an errow while creating the recipe. Error: ${error}`
			)
		);
	}
};
// const put = () => {
// 	// check the recipe exist

// 	// check is not deleted

// 	// if the user want to update a image
// 	if(imageId){

// 	}
// };
const remove = async (recipeId: number) => {
	try {
		const recipe = await Recipe.findByPk(recipeId);
		if (!recipe || recipe.end_date !== null) {
			return Promise.reject(new Error('Recipe not found, or already deleted'));
		}

		recipe.end_date = new Date();
		await recipe.save();
		return Promise.resolve();
	} catch (error) {
		return Promise.reject(error);
	}
};

export const recipesProvider = {
	post,
	get,
	remove,
};
