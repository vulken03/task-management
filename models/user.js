module.exports = (sequelize, Sequelize) => {
  const user = sequelize.define('user', {
    user_id:{

      type:Sequelize.INTEGER,
      primaryKey:true,
      autoIncrement:true,
      notNull:true
    },
    username: {
      type: Sequelize.STRING(20),
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

      type: Sequelize.BIGINT(10),
      allowNull: false,
      unique:true
    },
    password: {
    type: Sequelize.STRING(10),
    allowNull: false
    }
  })

    user.associate=(models)=>{
    user.hasMany(models.task,{foreignKey:'user_id',onDelete:'CASCADE',onUpdate:'CASCADE'})
  }

  return user
}
