module.exports = function (sequelize, Sequelize) {
	var User = sequelize.define("user", {
		id: {
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
		},

		firstname: {
			type: Sequelize.STRING,
			notEmpty: true
		},

		lastname: {
			type: Sequelize.STRING,
			notEmpty: true
		},

		username: {
			type: Sequelize.TEXT
		},

		about: {
			type: Sequelize.TEXT
		},

		/*favorite_bar: {
			type: Sequelize.TEXT
		},*/

		email: {
			type: Sequelize.STRING,
			validate: {
				isEmail: true
			}
		},

		password: {
			type: Sequelize.STRING,
			allowNull: false
		},

		last_login: {
			type: Sequelize.DATE
		},

		status: {
			type: Sequelize.ENUM("active", "inactive"),
			defaultValue: "active"
		}
	});

	User.associate = (models) => {
		User.hasMany(models.whiskeyFaves, { as: "Whiskeys" });
		User.hasMany(models.faveRecipes, { as: "Recipes" });
		User.hasMany(models.faveBars, { as: "Bars" });
	}

	return User;
};
