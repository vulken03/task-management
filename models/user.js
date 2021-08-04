module.exports = (sequelize, Sequelize) => {
  const user = sequelize.define('user', {
    user_id:{

      type:Sequelize.INTEGER,
      primaryKey:true,
      autoIncrement:true,
      notNull:true
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique:true
    },
    email:{
      type: Sequelize.STRING,
      allowNull: false,
      unique:true,
      isEmail:true
      },
    phoneno:{

      type: Sequelize.STRING,
      allowNull: false,
      unique:true
    },
    password: {
    type: Sequelize.STRING,
    allowNull: false
    }
  })

    user.associate=(models)=>{
    user.hasMany(models.task,{foreignKey:'user_id',onDelete:'CASCADE',onUpdate:'CASCADE'})
  }

  return user
}
