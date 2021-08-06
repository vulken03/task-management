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
      type: Sequelize.STRING, // TODO: standard char limit of email address should be given here!
      allowNull: false,
      unique:true,
      isEmail:true
      },
    phoneno:{

      type: Sequelize.BIGINT(10), // TODO: Use varchar(string) and allow user to enter +91/+1 country code along with + symbol
      allowNull: false,
      unique:true // TODO: remove uniquenesss
    },
    password: {
    type: Sequelize.STRING(10), // TODO: Store the password securly in encrypted format using crypto with salt & hash!
    allowNull: false
    }
  })

    user.associate=(models)=>{
    user.hasMany(models.task,{foreignKey:'user_id',onDelete:'CASCADE',onUpdate:'CASCADE'})
  }

  return user
}
// TODO - Create hash with salt password using sequelize hooks beforeCreate & beforeUpdate