var db = require("../models");

module.exports = {
	getAllWhiskeys: (userID, cb) => {
		db.whiskey.findAll().then((whiskeys) => {
			db.whiskeyFaves.findAll({ where: { userId: userID } }).then(faves => {
				faves.forEach(fave => {
					whiskeys[whiskeys.findIndex((val, ind, arr) => {
						return val.dataValues.id === fave.dataValues.whiskeyId;
					})].favorite = true;
				});
				cb(whiskeys);
			});
		});
	},

	getUser: (id, cb) => {
		db.user.findByPk(id).then(user => {
			createUser(user, cb);
		});
	},

	getAllRecipes: (userID, cb) => {
		db.recipe.findAll().then(recipes => {
			db.faveRecipes.findAll({ where: { userId: userID } }).then(faves => {
				faves.forEach(fave => {
					recipes[recipes.findIndex((val, ind, arr) => {
						return val.dataValues.id === fave.dataValues.recipeId;
					})].favorite = true;
				});
				cb(recipes);
			});
		});
	},

	getAllBars: (userID, cb) => {
		db.bar.findAll().then(bars => {
			db.faveBars.findAll({ where: { userId: userID } }).then(faves => {
				faves.forEach(fave => {
					bars[bars.findIndex((val, ind, arr) => {
						return val.dataValues.id === fave.dataValues.barId;
					})].favorite = true;
				});
				cb(bars);
			});
		});
	},

	getWhiskeyFaves: (userId, cb) => {
		db.user.findByPk(userId).then(user => {
			user.getWhiskeys(cb);
		});
	},

	toggleWhiskeyFavorite: (userID, whiskeyID) => {
		db.whiskeyFaves.findOrCreate({ where: { userId: userID, whiskeyId: whiskeyID } })
			.spread((fave, created) => {
				if (!created) {
					fave.destroy();
				}
			});
	},

	toggleRecipeFavorite: (userID, recipeID) => {
		db.faveRecipes.findOrCreate({ where: { userId: userID, recipeId: recipeID } })
			.spread((fave, created) => {
				if (!created) {
					fave.destroy();
				}
			});
	},

	toggleBarFavorite: (userID, barId) => {
		db.faveBars.findOrCreate({ where: { userId: userID, barId: barId } })
			.spread((fave, created) => {
				if (!created) {
					fave.destroy();
				}
			});
	},

	addRecipe: (name, ingredients, instructions, cb) => {
		db.recipe.create({ recipe_name: name, ingredients: ingredients, prep: instructions }).then(data => {
			cb(data);
		})
	},

	addBar: (name, address, placeID, cb) => {
		db.bar.create({ bar_name: name, bar_address: address, place_id: placeID }).then(data => {
			cb(data);
		})
	},



}

function createUser(user, cb) {
	user.getWhiskeys({ include: [db.whiskey] }).then(whiskeys => {
		user.getRecipes({ include: [db.recipe] }).then(recipes => {
			user.getBars({ include: [db.bar] }).then(bars => {
				console.log(bars);
				cb({
					firstname: user.firstname,
					lastname: user.lastName,
					id: user.id,
					email: user.email,
					about: user.about,
					last_login: user.last_login,
					whiskeys: whiskeys,
					recipes: recipes,
					bars: bars
				});
			})


		})
	});
}