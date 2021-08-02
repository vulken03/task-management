module.exports = (sequelize, Sequelize) => {
  const User_Registration = sequelize.define('User_Registration', {
    userId:{

      type:Sequelize.INTEGER,
      primaryKey:true,
      autoIncrement:true,
      notNull:true
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    }
  })

  User_Registration.associate=(models)=>{
    User_Registration.hasMany(models.task,{foreignKey:'userId',onDelete:'CASCADE',onUpdate:'CASCADE'})
  }

  return User_Registration
}
