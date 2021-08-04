module.exports=(sequelize,Sequelize)=>{

 const admin_module=sequelize.define('admin_module',{

    admin_id:{
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
      },
     
 }, { timestamps: false }) 

 return admin_module

}