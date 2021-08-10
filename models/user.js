const { encryptPassword } = require("../utils/encrypt");
module.exports = (sequelize, Sequelize) => {
  const user = sequelize.define(
    "user",
    {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        notNull: true,
      },
      username: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING(254),
        allowNull: false,
        unique: true,
        isEmail: true,
      },
      phoneno: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      hooks: {
        beforeCreate: (user) => {
          user.password = encryptPassword(user.password);
        },
        beforeUpdate: (updatedUser) => {
          if (updatedEmployee.password) {
            updatedUser.password = encryptPassword(updatedUser.password);
          }
        },
      },
    }
  );

  user.associate = (models) => {
    user.hasMany(models.task, {
      foreignKey: "user_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };

  return user;
};
// TODO - Create hash with salt password using sequelize hooks beforeCreate & beforeUpdate
